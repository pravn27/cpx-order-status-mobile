// +++++++++++++++++++++++
//        Imports
// +++++++++++++++++++++++
import Rest from 'grommet/utils/Rest';
import DataForm from 'form-data/lib/form_data'
import utilities from './utilities';
import config from '../utils/config';
import { appendLineToErrorLogsFile, readErrorLogsFile } from './fileUtils';

// Redux imports
import { setUserInitAction, userLoggedIn, userDeniedAccessRights, userLogout, userHasNoService, userLostInternetConnection }
  from '../actions/userActions';

// +++++++++++++++++++++++
//        Globals
// +++++++++++++++++++++++
const
  wso2AuthorizationToken = "Bearer 777d6a9b34c4e72b0ec528221dcd5384",
  prpBaseUrlStg = "https://api-stg-sgw.ext.hpe.com/gw/hpeit/cpx/hpeit.cpx.prmobile.itg",
  prpBaseUrlMock = "http://16.202.71.120:8080/cpx-web/api/secure/jsonws",
  prpBaseUrlMockWso2 = "https://api-stg-sgw.ext.hpe.com/gw/egit/rdit/apigateway.itg/cpx/mock-v2",
  PRP_API_BASE_URL = config.getIsDebug() ? prpBaseUrlMockWso2 : prpBaseUrlStg;

// This Dispatch function should NOT be used as
// a general purpose dispatch.
// This dispatch is used to simplify some common
// actions like the error messages.
// Remember that the actions should be dispatched
// by a component or by another action.
let dispatch; // Used to connect with Redux

// +++++++++++++++++++++++
//         Set up
// +++++++++++++++++++++++

// Configuring Rest headers
Rest.setHeaders({
  'Accept': 'application/json',
  //'Authorization': wso2AuthorizationToken,
  'Access-Control-Allow-Origin': 'http://localhost:4400'// Still needs to validate IP/DNS for security
});




// +++++++++++++++++++++++
//         Utils
// +++++++++++++++++++++++
function handleRequestErrorsWithActions(err, response, serviceErrorWithUIMessage = true, simulationMode = false) {


  if (err && err.timeout) {
    let errorMsg = { messageId: 'timeout' };

    if (config.showDebugMessages) {
      errorMsg = err instanceof Error ? err : new Error(err);
    }

    return dispatch(userHasNoService( errorMsg ));
  }


  if (response) {

    if (response.statusCode === 200) {// Success
      return;// Nothing to do, everything good
    }


    // logs into the file
    appendLineToErrorLogsFile(`${response.req.method} ${response.req.url}: "${JSON.stringify(response.body)}"`);

    // Creates the object that the modal popups will use
    let errorMsg = err instanceof Error ? err : new Error(err);
    if (response.req) {
      errorMsg.serviceRequest = response.req;
      errorMsg.errorBody = response.body;
    }

    switch (response.statusCode) {
      case 401:// Authentication failed
        dispatch(userLogout());
      case 403:// Access forbidden
        dispatch(userDeniedAccessRights(errorMsg));
        return;

      case 404:// Not Found
      if(simulationMode) {
          dispatch(userDeniedAccessRights(errorMsg));
          return;
      }
      else {
        if (!serviceErrorWithUIMessage) {
          console.error(errorMsg);
          return; // Don't shows any message to the user
        }
        return dispatch(userHasNoService( errorMsg ));
      }
      
      case 500:// Internal server error
      default: // Server responded but not in a good manner

        if (!serviceErrorWithUIMessage) {
          console.error(errorMsg);
          return;// Don't shows any message to the user
        }

        return dispatch(userHasNoService( errorMsg ));
    }
  }

  // Server did not responded, either the user does not
  // have internet connection or the backed server is down.
  dispatch(userLostInternetConnection());
}



// +++++++++++++++++++++++
//       HPE Plugin
// +++++++++++++++++++++++
export const hpe_logInUser = (userId, password) => {

	return new Promise((resolve, reject) => {

    hpeLogin.loginWithCredentials(userId, password, function (response) {
      // Depending on the status returned, we can assume that there is an active session or not
      if (response) {

        if (response.status === "ok") {// Session is valid
          return resolve(response);
        }

        return reject(response);// Authentication failed
      }

      // Something went wrong with the plugin
      reject({ code: 'PLUGIN_ERROR', error: `Unknow error ocurred on the 'cordova-plugin-sgw-mobile'.` });
    });

  });// return new Promise

}// hpe_logInUser

export const hpe_logOutUser = () => {
  return new Promise((resolve, reject) => {

    hpeLogin.logout(function (response) {
      if (response) {

        if (response.status === "ok") {
          return resolve(response);
        }

        return reject( response );
      }

      // Something went wrong with the plugin
      reject({ code: 'PLUGIN_ERROR', error: `Unknow error ocurred on the 'cordova-plugin-sgw-mobile'.` });
    });

  });// return new Promise
}// hpe_logOutUser




// +++++++++++++++++++++++
//     PRP api calls
// +++++++++++++++++++++++

/*
 * Function: initializeUser
 * Descpription: Calls the PRP user init service.
 * Parameters:
 *	watchList		If need to return the watch list details.
 *	recentSearchList	If need to return the recent search list details.
 *	alertList		If need to return the unread alert list details.
 */
var _initializeUser = function (recentSearchList, watchList, alertList, serviceErrorWithUIMessage = false, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/init`;
  var params = { 'recentSearchList': recentSearchList, 'watchList': watchList, 'alertList': alertList, 'doAsUser': doAsUser};
  return new Promise((resolve, reject) => {

    Rest.setTimeout(config.USER_INIT_REST_TIMEOUT);
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.get(initUrl, params).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response, serviceErrorWithUIMessage, 
        doAsUser != 'null'); // User is simulated, if doAsUser is not 'null'

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });
  })

};

/*
 * Function: add watchlist
 * Description: Calls the PRP user watchlist service. This is FOR V2 spec.
 * Parameters:
 *	qtcuid		qtcuid value
 */
var _addWatchList = function(qtcuid, doAsUser = 'null') {
	//var initUrl = `${PRP_API_BASE_URL}/user/watchlist`;
	var initUrl = `${PRP_API_BASE_URL}/user/watchlist`;
	//do not allow the program to continue as there is NO qtcuid value.
	if(qtcuid === undefined || qtcuid == null ){
		return;
	}

  var formData = new FormData();
  formData.append('assetId', qtcuid);
  formData.append('assetType', 'com.hpe.prp.cpx.model.Order');
  formData.append('doAsUser', doAsUser);

	return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
		Rest.put(initUrl,formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });

  })
};


//Get RecentSearch
var _getRecentSearch = function (doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/recentsearch`;

  return new Promise((resolve, reject) => {
    var params = { 'doAsUser': doAsUser};
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.get(initUrl, params).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
  })

};

//Remove recent searches
var deleteRecentSearch = function (searchId, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/recentsearch?searchId=` + searchId + `&doAsUser=`+ doAsUser;

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.del(initUrl).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
  })

};

/*
 * Function: add watchlist
 * Description: Calls the PRP user watchlist service. This is FOR V2 spec.
 * Parameters:
 *	qtcuid		qtcuid value
 */
var _removeWatchList = function (qtcuid, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/watchlist?assetType=com.hpe.prp.cpx.model.Order&assetId=`+ qtcuid + `&doAsUser=`+ doAsUser;

  //do not allow the program to continue as there is NO qtcuid value.
  if (qtcuid === undefined || qtcuid == null) {
    return;
  }

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.del(initUrl).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });

  })

}

//Get WatchList
var _getWatchList = function (assetType, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/watchlist?assetType=` + assetType + `&doAsUser=`+ doAsUser;
  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.get(initUrl).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
    resolve(response);
    });
  })

};


/*
 * Function: send feedback
 * Description: Calls the PRP order feedback service. This is FOR V3 spec.
 * Parameters:
 *  qtcuid    qtcuid value
 *  feedback  [
 *              {
 *                “question”: ”<question identifier>”,
 *                “answer”: “<user’s answer>”
 *              },
 *              ...
 *            ]
 */
var _sendOrderFeedback = function (qtcuid, feedback, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/order/feedback`;
  var formData = new FormData();
  formData.append('qtcuid', qtcuid);
  formData.append('survey', feedback);
  formData.append('doAsUser', doAsUser);

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.put(initUrl, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
    resolve(response);
    });
  })

};

//Subscribing to alerts for the item added to WatchList
var _alertOnWatchList = function (qtcuid, assetType, isAlertSubscribed, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/watchlist`;
  if (qtcuid === undefined || qtcuid == null) {
    return;
  }

  var formData = new FormData();
  formData.append('assetId', qtcuid);
  formData.append('assetType', assetType);
  formData.append('isAlertsSubscribed', isAlertSubscribed);
  formData.append('doAsUser', doAsUser);

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.post(initUrl, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });

  })

}

var getOrderDetails = function (id, doAsUser = 'null') {
  var api = `${PRP_API_BASE_URL}/order/details`;
  var params = { 'qtcuid': id, 'doAsUser': doAsUser };

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.get(api, params).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });
  });
};


var getPreferences = function (doAsUser = 'null') {
  var getPrefUrl = `${PRP_API_BASE_URL}/user/preference`;
  var params = { 'doAsUser': doAsUser };
  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.get(getPrefUrl, params).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if(err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });
  });
  // return (require("../../data/preferences.json"));
};

var postPreferences = function (pref, val, doAsUser = 'null') {
  var postPrefUrl = `${PRP_API_BASE_URL}/user/preference`;
  var formData = new FormData();
  formData.append('preferences', pref);
  formData.append('values', val);
  formData.append('doAsUser', doAsUser);

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.post(postPrefUrl, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);

      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }

      resolve(response);
    });
  })
};

//Alerts
var _updateAlert = function (alertId, isNew, doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/user/alert`;
  var formData = new FormData();
  formData.append('alertId', alertId);
  formData.append('isNew', isNew);
  formData.append('doAsUser', doAsUser);

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.post(initUrl, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
        if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
  })

};

var _advancedSearchOrders = function (query, filterInput, sort, start, end, doAsUser = 'null') {
  var url = PRP_API_BASE_URL + "/search/order";
  var criteria = [];
  
  if (query.advancedSearch_shipToAddressString != null && query.advancedSearch_shipToAddressString != '') {
    criteria.push({ 'key': "ship_to_address", 'type': "TEXT", 'value': query.advancedSearch_shipToAddressString });
  }
  if (query.advancedSearch_hpeProductNumberString != null && query.advancedSearch_hpeProductNumberString != '') {
    criteria.push({ 'key': "product_no", 'type': "TEXT", 'value': query.advancedSearch_hpeProductNumberString });
  }

  var order_date = {};
  if ( query.advancedSearch_orderStartDate ) {
    order_date.from = query.advancedSearch_orderStartDate;
  }
  if ( query.advancedSearch_orderEndDate ) {
    order_date.to = query.advancedSearch_orderEndDate;
  }
  if (order_date.from  || order_date.to ) {
    criteria.push({ 'key': "creation_date", 'type': "DATE_RANGE", 'value': order_date });
  }

  var ship_date = {};
  if ( query.advancedSearch_shipStartDate) {
    ship_date.from = query.advancedSearch_shipStartDate;
  }
  if ( query.advancedSearch_shipEndDate) {
    ship_date.to = query.advancedSearch_shipEndDate;
  }
  if (ship_date.from  || ship_date.to ) {
    criteria.push({ 'key': query.advancedSearch_shipDateField, 'type': "DATE_RANGE", 'value': ship_date });
  }

 //var searchQuery = { 'criteria': criteria, 'filters': filters, 'sort': sort };
  var searchQuery = { 'criteria': criteria };
  if (filterInput != null) {
    //searchQuery.filters = [{ 'key': 'order_status', 'type': 'ARRAY', 'value': filterInput }];
    searchQuery.filters = filterInput;
  }

  if( sort != null ) {
    searchQuery.sort = sort;
  }

  //var params = { 'objectType': 'com.hpe.prp.cpx.model.Order', 'searchQuery': searchQuery, 'start': start, 'end': end };

  var searchQ = JSON.stringify(searchQuery);

  //console.log("yujietest:"+searchQ +":" + start + ":" + end); //check json correct or not

  var formData = [];
  formData.push(encodeURIComponent('objectType')+'='+encodeURIComponent('com.hpe.prp.cpx.model.Order'));
  formData.push(encodeURIComponent('searchQuery')+'='+encodeURIComponent(searchQ));
  formData.push(encodeURIComponent('start')+'='+ encodeURIComponent(start));
  formData.push(encodeURIComponent('end')+'='+encodeURIComponent(end));
  formData.push(encodeURIComponent('doAsUser')+'='+encodeURIComponent(doAsUser));
  formData = formData.join("&");
  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    Rest.post(url, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
        if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
  })
};

var _searchOrders = function (key, filterInput, sort, start, end, doAsUser = 'null') {
  var formData = [];
  var url = PRP_API_BASE_URL + "/search/order";
  //var criteria1 = '{ "key": "term", "type": "TERM", "value": "' + key + '" }';
  //var searchQuery1 = '{ "criteria":  ' + criteria1 + '  }';
  var criteria = {'key': 'term', 'type': 'TERM', 'value': key};
  var searchQuery = { 'criteria': criteria };
  if (filterInput != null) {
    //searchQuery.filters = [{ 'key': 'order_status', 'type': 'ARRAY', 'value': filterInput }];
    searchQuery.filters = filterInput;
  }
  if( sort != null ) {
    searchQuery.sort = sort;
  }
  var searchQ = JSON.stringify(searchQuery);
  //console.log("yujietest:"+searchQ +":" + start + ":" + end); //check json correct or not
  
  formData.push(encodeURIComponent('objectType')+'='+encodeURIComponent('com.hpe.prp.cpx.model.Order'));
  formData.push(encodeURIComponent('searchQuery')+'='+encodeURIComponent(searchQ));
  //formData.append(encodeURIComponent('searchQuery')+'='+ encodeURIComponent(searchQuery1));
  formData.push(encodeURIComponent('start')+'='+ encodeURIComponent(start));
  formData.push(encodeURIComponent('end')+'='+encodeURIComponent(end));
  formData.push(encodeURIComponent('doAsUser')+'='+encodeURIComponent(doAsUser));

  formData = formData.join("&");

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    Rest.post(url, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
        if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
  })
};

var _sendContactForm = function (contactSupport,doAsUser = 'null') {
  var initUrl = `${PRP_API_BASE_URL}/support/case`;
  var formData = new FormData();
  formData.append('poNumber', contactSupport.poNumber);
  formData.append('hpOrderNumber', contactSupport.hpeOrderNumber);
  formData.append('countryOfSubmitter', contactSupport.countryOfSubmitter);
  formData.append('valueVolume', contactSupport.valueVolume);
  formData.append('caseReason', contactSupport.caseReason);
  formData.append('scenario', contactSupport.scenario);
  formData.append('subject', contactSupport.subject);
  formData.append('caseDescription', contactSupport.description);
  formData.append('doAsUser', doAsUser);

  return new Promise((resolve, reject) => {
    Rest.setHeader('Content-Type', undefined); //unset content-type
    Rest.put(initUrl, formData).withCredentials().end((err, response) => {
      handleRequestErrorsWithActions(err, response);
      if (err) {
        return reject( err instanceof Error ? err : new Error(err) );
      }
      resolve(response);
    });
 })
};

export const apiCommunicator = {
  setDispatch: (d) => { dispatch = d; },// Sets the dispatch function used to connect with Redux
  getLastUpdate: () => new Date(),
  getAlertsCount: () => 7,
  getUserInfo: _initializeUser,
  getWatchList: _getWatchList,
  alertOnWatchList: _alertOnWatchList,
  getRecentSearch: _getRecentSearch,
  deleteRecentSearch: deleteRecentSearch,
  addWatchList: _addWatchList,
  removeWatchList: _removeWatchList,
  sendOrderFeedback: _sendOrderFeedback,
  conditionsAccepted: () => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  getAppFirstLogin: () => {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  },
  getOrderDetails: getOrderDetails,
  updateAlert: _updateAlert,
  getPreferences: getPreferences,
  postPreferences: postPreferences,
  searchOrders: _searchOrders,
  advancedSearchOrders: _advancedSearchOrders,
  sendContactForm: _sendContactForm

};

export default apiCommunicator;
