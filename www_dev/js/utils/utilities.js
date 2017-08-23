// Return list of shipments with the list of products for each shipment 
var getShipmentList = (shipments, products, type) => {
  products = clone(products);
  return shipments.map(function(item, index) {
    let shipment = clone(item);
    shipment.productList = [];
    for (var i=0; i<products.length; i++) {
      if(products[i].shipment_no === shipment.shipment_no && products[i].item_status === type) {
        shipment.productList.push(products[i]);
        products.splice(i, 1);
        i--;
      }
    }
    if (shipment.productList.length > 0) {
      shipment.date = shipment.productList[0].actual_delv_date || shipment.productList[0].planned_delv_date || shipment.productList[0].actual_ship_date;
	  
	  if(type == "Shipped to Customer"){
		  shipment.date = shipment.productList[0].actual_ship_date; //introduced as this type contains actual_delv_date and planned_delv_date and planned_ship_date as we do not need it.
		  
	  }
      return shipment;
    }
  }).filter( item => typeof item !== 'undefined');
};

var getNotShippedList = (products, statusList) => { 
  return products.filter( item => { return ((item.item_status) ? statusList.indexOf(item.item_status)!==-1 : false) });
};

var formatDate = (date) => {
  if (!date)
    return date;

  const splitedDateString = date.split(/[-T:.]/gi);
  let d = new Date(splitedDateString[0], splitedDateString[1] - 1, splitedDateString[2]);
  if (d.toDateString() === "Invalid Date" || d.toISOString().indexOf("T") < 0)
    return date;
  
  var date = splitedDateString[2]
  var month = splitedDateString[1]
  var year = splitedDateString[0];
  
  return month + '-' + date + '-' + year ;
};

//String input, check String is a correct date format or not
var checkDateFormat = (date) => {
    try {
        var d = new Date(date);
        if (d.toDateString() === "Invalid Date" || d.toISOString().indexOf("T") < 0) {
            if ( d.toDateString() === "Invalid Date") {
                //special action for iphone, example: 02-21-2017
                var arr = date.split("-"),
                d = new Date(arr[2], arr[0]-1, arr[1]); //2
                if( d.toDateString() === "Invalid Date" || d.toISOString().indexOf("T") < 0 ) {
                    return false;
                } else {
                    //correct;
                }
            } else  {
                return false;
            }
        }
        var date_regex1 = /^\d{2}\-\d{2}\-\d{4}$/; //02-21-2017
        var date_regex2 = /^\d{1}\-\d{2}\-\d{4}$/; //grommet calendar input has problem 2-21-2017 manual input
        var date_regex3 = /^\d{2}\-\d{1}\-\d{4}$/; //grommet calendar input has problem 12-1-2017 manual input
        var date_regex4 = /^\d{1}\-\d{1}\-\d{4}$/; //grommet calendar input has problem 2-1-2017 manual input
        if(  date_regex1.test(date) || date_regex2.test(date) || date_regex3.test(date) || date_regex4.test(date) ) {
            //correct;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true; // correct date format
};

var earlierThan90 = (startdate) => {
    var today = new Date();
    var startday = new Date(startdate);
    if(isNaN(startday)) {
        //ios can not identify 09-12-2016
        var dates=startdate.split('-'); 
        startday = new Date();
        startday.setFullYear(dates[2]);
        var month = parseInt(dates[0]) - 1;
        startday.setMonth(month);
        startday.setDate(dates[1]);
    }
    //var timeDiff = Math.abs(today.getTime() - startday.getTime());
    var timeDiff = today.getTime() - startday.getTime();
    if(timeDiff > 0) {
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24 )); 
        if(diffDays > 90) {
            return true;
        }
    }
    return false
};

var toTwoDigits = function(num) {
  if (parseInt(num / 10) === 0) {
    return '0' + num;
  }
  return num;
};

function formatDatetime(datetime) {
  if (!datetime)
    return datetime;
  
   let d = new Date(datetime);
  if (d.toDateString() === "Invalid Date" || d.toISOString().indexOf("T") < 0)
    return datetime;

  var fullDate = new Date(datetime.toLocaleString());
  var date = fullDate.getDate().toString().length > 1 ? fullDate.getDate().toString() : "0" + fullDate.getDate().toString();
  var month = (fullDate.getMonth() + 1).toString().length > 1 ? (fullDate.getMonth() + 1).toString() : "0" + (fullDate.getMonth() + 1).toString();
  var year = fullDate.getFullYear();
  var hour = fullDate.getHours();
  var minute = fullDate.getMinutes();
  var ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  minute = minute < 10 ? "0" + minute : minute;  

  return month + '-' + date + '-' + year + ', ' + hour + ':' + minute + ' ' + ampm;
}

var toTwoDigits = function(num) {
  if (parseInt(num / 10) === 0) {
    return '0' + num;
  }
  return num;
};


// get the order's overall ship/delivered date from the list of orders
var getOverallDate = function(mode, orderDetails) {
  orderDetails = clone(orderDetails);
  var currDate = "TBD";
  var dateToCheck = "";

  // check which data should we get
  if(mode != "") {
    if(orderDetails.ship_status.toLowerCase() == "fully shipped")
      dateToCheck = "overall_" + mode + "_date";
    else
      dateToCheck = "planned_" + mode + "_date";
  }

  // need this logic to check if the items are fully shipped fully delivered or fully shipped not yet delivered
  if(dateToCheck === "overall_delv_date") {
    if(orderDetails.overall_delv_date !== null)
      dateToCheck = orderDetails.overall_delv_date.trim().length <= 0 ? "planned_delv_date" : "overall_delv_date";
    else
      dateToCheck = "planned_delv_date";
  }

  if (orderDetails[dateToCheck] !== null && orderDetails[dateToCheck].trim().length > 0)
    currDate = formatDate(orderDetails[dateToCheck]);
  else
    currDate = "TBD";
  
  return currDate;
};

// make a deep copy of an object or array
var clone = function(o) {
  if(o.constructor === Array)
    return [...o];
  else
    return Object.assign({}, o);
};

/*
  Return the grommet's value for 'margin' and 'pad' props.
  Accepts a string or an array of strings (when multiple settings are needed).
  E.g. <Box margin={utilities.getStyle("horizontalSmall")}>;
       <Box size={utilities.getStyle(["heightMinMedium", "widthMaxLarge"])}>
  Other values needed but not found should be added to the object below: ref.sizes
*/
var getStyle = function(type) {
  if (typeof type === "string") {
    return ref.sizes[type];
  }
  let obj = {};
  type.forEach((t) => {
    const size = ref.sizes[t];
    for (var key in size) {
      obj[key] = size[key];
    }
  });
  return obj; 
};

var tracking = function(pageName, analytics, searchObject = null) {
  //if (typeof window.parent.ripple === "function") return; // do not track ripple simulator pages
  try {
    var _analytics = Object.assign({}, analytics);
    _analytics.siteId = "Mobile APP";
    _analytics.deviceInfo = device.model + "/" + device.platform + "/" + device.version;
    switch (pageName) {
      case 'SplashScreen': // Capture successful login & init
        _analytics.appEvent = 'userLogin'; 
        break;
      case 'SearchResult':  //called after search results is loaded with search results //TODO: do not track page change for Search Result
        if (searchObject !== null) {
          _analytics.searchTerm = searchObject.searchedString; 
          _analytics.searchResultsCount = searchObject.searchResultCount;
          _analytics.searchType = searchObject.searchType;
          _analytics.appEvent = 'search';
        }
        break;
      case 'NotificationAlert':
        _analytics.appEvent = 'alertNotify';
        break;
      case 'AlertClicked': 
        _analytics.appEvent = 'clickAlert';
        break;
      default:
        break;
    }
    ADB.trackState(pageName, _analytics); 
  }
  catch (ex) {
    // do nothing
  }
  finally {
    // do nothing
  }
}

var addClassModalParent = function() {
    $('body').addClass('lock-background-scroll');
}
var removeClassModalParent = function() {
    if($('body').hasClass("lock-background-scroll"))
        $('body').removeClass('lock-background-scroll');
}

module.exports = {
  formatDate: formatDate,
  formatDatetime: formatDatetime,
  getOverallDate: getOverallDate,
  getNotShippedList: getNotShippedList,
  getShipmentList: getShipmentList,
  clone: clone,
  getStyle: getStyle,
  tracking: tracking,
  checkDateFormat: checkDateFormat,
  earlierThan90: earlierThan90,
  addClassModalParent: addClassModalParent,
  removeClassModalParent: removeClassModalParent
};

const ref = {
  sizes: {
    heightMinSmall: {"height": {"min": "small"}},
    heightMinMedium: {"height": {"min": "medium"}},
    heightMinLarge: {"height": {"min": "large"}},
    
    heightMaxSmall: {"height": {"max": "small"}},
    heightMaxMedium: {"height": {"max": "medium"}},
    heightMaxLarge: {"height": {"max": "large"}},

    widthMinAuto: {"width": {"min": "auto"}},
    widthMinXsmall: {"width": {"min": "small"}},
    widthMinSmall: {"width": {"min": "small"}},
    widthMinMedium: {"width": {"min": "medium"}},
    widthMinLarge: {"width": {"min": "large"}},
    widthMinXlarge: {"width": {"min": "xlarge"}},
    widthMinXxlarge: {"width": {"min": "xxlarge"}},
    widthMinFull: {"width": {"min": "full"}},
    
    widthMaxAuto: {"width": {"max": "auto"}},
    widthMaxXsmall: {"width": {"max": "small"}},
    widthMaxSmall: {"width": {"max": "small"}},
    widthMaxMedium: {"width": {"max": "medium"}},
    widthMaxLarge: {"width": {"max": "large"}},
    widthMaxXlarge: {"width": {"max": "xlarge"}},
    widthMaxXxlarge: {"width": {"max": "xxlarge"}},
    widthMaxFull: {"width": {"max": "full"}},

    horizontalSmall: {"horizontal": "small"},
    horizontalMedium: {"horizontal": "medium"},
    horizontalLarge: {"horizontal": "large"},
    horizontalXlarge: {"horizontal": "xlarge"},
    verticalSmall: {"vertical": "small"},
    verticalMedium: {"vertical": "medium"},
    verticalLarge: {"vertical": "large"}
  }
};


Object.assign = Object.assign || function (target) { 
  for (var i = 1; i < arguments.length; i++) { 
    var source = arguments[i]; 
    for (var key in source) { 
      if (Object.prototype.hasOwnProperty.call(source, key)) { 
        target[key] = source[key]; 
      } 
    } 
  } 
  return target; 
};