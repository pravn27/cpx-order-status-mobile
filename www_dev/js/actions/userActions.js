// +++++++++++++++++
//    Imports
// +++++++++++++++++
import config from '../utils/config';
import { registerPushAction } from './pusherActions';
import { initializeApp } from '../actions/deviceActions';
import apiCommunicator, { hpe_logInUser, hpe_logOutUser } from '../utils/apiCommunicator';



// ++++++++++++++++++++++
// Globals
// ++++++++++++++++++++++
const { INCORRECT_CREDENTIALS, INTERNAL_ERROR, WRONG_PARAMS } = hpeLogin.config.loginFailureEnum;
const TIME_FOR_USER_DATA_UPDATE = config.TIME_FOR_USER_DATA_UPDATE || 780000;// 13 minutes is the default
// TODO Need to change handling of debug flag
// const rememberScope = config.getIsDebug() ? config.rememberScopeStg : config.rememberScopePro;
// const env = config.getIsDebug() ? config.defaultStgEnv : config.defaultProEnv;
const rememberScope = config.rememberScopeStg;
const env = config.defaultStgEnv;




// ++++++++++++++++++++++
// Exported Action names
// ++++++++++++++++++++++

// User init
export const USER_INFO_RECEIVED = 'USER_INFO_RECEIVED';
export const FETCHING_USER_INFO = 'FETCHING_USER_INFO';
export const FETCHING_USER_INFO_FAILED = 'FETCHING_USER_INFO_FAILED';
export const USER_INFO_INITIALIZING = 'USER_INFO_INITIALIZING';
export const USER_INFO_INITIALIZED = 'USER_INFO_INITIALIZED';
export const USER_INFO_INITIALIZATION_FAILED = 'USER_INFO_INITIALIZATION_FAILED';
export const SIMULATION_MODE = 'SIMULATION_MODE';
export const USER_AUTHENTICATING = 'USER_AUTHENTICATING';
// Error messages
export const USER_DENIED_ACCESS_RIGHTS = 'USER_DENIED_ACCESS_RIGHTS';
export const USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS = 'USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS';
export const USER_LOST_INTERNET_CONNECTION = 'USER_LOST_INTERNET_CONNECTION';
export const USER_RECOVERED_INTERNET_CONNECTION = 'USER_RECOVERED_INTERNET_CONNECTION';
export const USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION = 'USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION';
export const USER_HAS_NO_SERVICE = 'USER_HAS_NO_SERVICE';
export const USER_ACKNOWLEDGE_NO_SERVICE = 'USER_ACKNOWLEDGE_NO_SERVICE';
export const EMAIL_NOT_AVAILABLE = "EMAIL_NOT_AVAILABLE";
export const USER_ACK_EMAIL_NOT_AVAILABLE = "USER_ACK_EMAIL_NOT_AVAILABLE";

// User login
export const USER_TRIES_TO_LOGIN = 'USER_TRIES_TO_LOGIN';
export const USER_FAILED_TO_LOGIN = 'USER_FAILED_TO_LOGIN';
export const USER_LOGGED = 'USER_LOGGED';
export const USER_LOGOUT = 'USER_LOGOUT';

// Terms & Conditions
export const USER_ACCEPTS_TERMS_AND_CONDITIONS = 'USER_ACCEPTS_TERMS_AND_CONDITIONS';
export const USER_DECLINED_TERMS_AND_CONDITIONS = 'USER_DECLINED_TERMS_AND_CONDITIONS';
export const GET_USER_TERMS_AND_CONDITIONS_STATUS = 'GET_USER_TERMS_AND_CONDITIONS_STATUS';

// Tutorial
export const USER_SKIPPED_OR_COMPLETED_TUTORIAL = 'USER_SKIPPED_OR_COMPLETED_TUTORIAL';

// ++++++++++++++++++++++
// Internal Actions
// ++++++++++++++++++++++

// User log in
const userLoggedOut = () => ({
  type: USER_LOGOUT
})

const userLoggedIn = (userId, sessiontk, idpid, actualUserId) => ({
  type: USER_LOGGED,
  authData: {
    userId,
    sessiontk,
    idpid,
    actualUserId
  }
})

const userAuthenticated = (userId, sessiontk, idpid, actualUserId) => {
  return (dispatch, getState) => {
    dispatch (userAuthenticating(false));
    dispatch( getUserTermsConditionsStatus() );
    dispatch( userLoggedIn(userId, sessiontk, idpid, actualUserId) );// user logged in
    let { userHasAcceptedTermsAndConditions } = getState().userInit;
    let { userHasSkippedOrDoneTutorial } = getState().userInit;

    if (userHasAcceptedTermsAndConditions && userHasSkippedOrDoneTutorial) {
      // Let's do the whole initialization stuff
      // this includes pusher and user info.
      dispatch( userInitilize(getState().userInit.userSimulation.simulatedUser) );
    }
  };
}

const errorDuringLogOut = (err) => {
  return (dispatch) => {

    switch (err.code) {

      case INTERNAL_ERROR:
      // This commonly means no InternetConnection, but also that something incredibly bad
      // happened to the plugin which is a rare case.
          dispatch( userLostInternetConnection() );
          break;

      case 'PLUGIN_ERROR':
      default:
        dispatch( userHasNoService() );
        break;
    }

  };
}

const errorDuringLogin = (err) => {
  return (dispatch, getState) => {
    dispatch (userAuthenticating(false));
    dispatch( userLogout() );// Logs out the user because something failed with their authentication

    const { device } = getState();

    switch (err.code) {
      case INCORRECT_CREDENTIALS:
      case WRONG_PARAMS:
        dispatch( userDeniedAccessRights('invalid_user_or_password') );
        break;

      case INTERNAL_ERROR:
      // This commonly means no InternetConnection, but also that something incredibly bad
      // happened to the plugin which is a rare case.
          dispatch( userLostInternetConnection() );
          break;

      case 'PLUGIN_ERROR':
      default:
        dispatch( userHasNoService() );
        break;
    }

  };
}// Ends 'errorDuringLogin'

// User info
const userInfoReceived = (userInfo) => ({
  type: USER_INFO_RECEIVED,
  userInfo: userInfo,
  last_updated: new Date()
})

const fetchingUserInfo = () => ({
  type: FETCHING_USER_INFO
})

const failedToGetUserInfo = (error) => ({
  type: FETCHING_USER_INFO_FAILED,
  error
})

const setSimulationMode = (mode, doAsUser) => ({
  type: SIMULATION_MODE,
  userSimulation : { simulationMode : mode, simulatedUser : doAsUser }
})

const getUserInfo = (isUserInitialization = false, recentSearchList = true, 
                     watchList = true, alertList = true, doAsUser = 'null') => (dispatch, getState) => 

{
  dispatch(fetchingUserInfo());

  apiCommunicator.getUserInfo(recentSearchList, watchList, alertList, isUserInitialization, doAsUser)
    .then(response => {
      if (200 === response.statusCode) {
        dispatch(userInfoReceived(response.body));

        if (doAsUser != 'null')
          dispatch( setSimulationMode(true, doAsUser) );
        else
          dispatch( setSimulationMode(false, doAsUser) );

        if (isUserInitialization) {// If enters here means it's an initialization call
          dispatch( userInfoInitialized() );
        }
      }
    })
    .catch(err => {

      if (isUserInitialization) {// If enters here means it's an initialization call
        dispatch( userInfoInitFailed() );
        dispatch( userLogout() );// We logout the user so he does not get stuck on the splash screen
      }

      dispatch( failedToGetUserInfo(err) );
    });
}

// User Init
const userInfoInitialized = () => (dispatch, getState) => {
  
  var doAsUser = getState().userInit.userSimulation.simulatedUser;

  // Enables push notifications
  let { userAuthData } = getState().userInit;
  dispatch( registerPushAction( userAuthData ) );

  // Ends dispatching the USER_INFO_INITIALIZED action
  dispatch({
    type: USER_INFO_INITIALIZED
  });
}

const userInfoInitializing = () => ({
  type: USER_INFO_INITIALIZING
})

const userAuthenticating = (flag) => ({
  type: USER_AUTHENTICATING,
  flag: flag
})

const userInfoInitFailed = () => ({
  type: USER_INFO_INITIALIZATION_FAILED
})

const userInitilize = (simulatedUser = 'null') => (dispatch) => {
  dispatch( userInfoInitializing() );
  dispatch( getUserInfo(true, true, true, true, simulatedUser) );
}

const getUserTermsConditionsStatus = () => ({
  type: GET_USER_TERMS_AND_CONDITIONS_STATUS,
  status: null !== window.localStorage.getItem('terms_and_conditions_accepted')
})

// ++++++++++++++++++++++
// Action exports
// ++++++++++++++++++++++

// Error messages
export const userDeniedAccessRights = (messageId, titleId) => ({
  type: USER_DENIED_ACCESS_RIGHTS,
  messageId,
  titleId
})

export const userAcknowledgeDeniedAccessRights = () => ({
  type: USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS
})

export const userLostInternetConnection = () => ({
  type: USER_LOST_INTERNET_CONNECTION
})

export const userRecoveredInternetConnection = () => ({
  type: USER_RECOVERED_INTERNET_CONNECTION
})

export const userAcknowledgeLostInternetConnection = () => ({
  type: USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION
})

export const emailNotAvailable = () => ({
  type: EMAIL_NOT_AVAILABLE
})

export const userAckEmailNotAvailable = () => ({
  type: USER_ACK_EMAIL_NOT_AVAILABLE
})

export const userHasNoService = (obj) => {
  let titleId, messageId;

  if (typeof obj === 'object') {
    titleId = obj.titleId;
    messageId = obj.messageId;
  }

  if (config.showDebugMessages && obj instanceof Error) {
    messageId = obj;
    console.error(obj);
  }

  return {
    type: USER_HAS_NO_SERVICE,
    titleId,
    messageId // This parameter can be either a String or an Error object
  }
}

export const userAcknowledgeNoService = () => ({
  type: USER_ACKNOWLEDGE_NO_SERVICE
})


// User Log In
export const userTriesToLogin = (userId, password, remember) => {
	
  
  var scope, idp;
  var reInitialize = false;
  
  if(remember) {
	  //user has selected "Remember Me" during login.  Reinitialize SSO with a modified scope so they get the long term token
	  scope = rememberScope;
	  idp = config.defaultIdp;
	  reInitialize = true;
  }
  if(userId.includes("hpe.com")) {
	  // simulation user, login via ed, do not allow rememberMe
	  scope = config.defaultScope;
	  idp = config.simulatorIdp;
	  reInitialize = true;
  }
  
  if(reInitialize) {
	  console.log("Re-initializing app with remember scope");
	  return dispatch => {
    dispatch (userAuthenticating(true));
		ssoReinitialize(env, idp, scope)
		  .then(() => hpe_logInUser(userId, password) ) // Log in
		  .then(res => dispatch( userAuthenticated(res.userid, res.sessiontk, res.idpid, userId) ) )// Logged in
	      .catch(err => dispatch( errorDuringLogin(err) ))}// Failed to log in
  } else {
    return dispatch => {
      dispatch (userAuthenticating(true));
      hpe_logInUser(userId, password)
        .then(res => dispatch( userAuthenticated(res.userid, res.sessiontk, res.idpid, userId) ) )// Logged in
        .catch(err => dispatch( errorDuringLogin(err) ))// Failed to log in
    };
  }
}

export const userSessionRecovered = (userId, sessiontk, idpid) => {
  return dispatch => {
    dispatch( userAuthenticated(userId, sessiontk, idpid) );
  };
}

export const userLogout = () => {

return (dispatch, getState) => {
  dispatch( setSimulationMode(false, 'null') ); // This is to exit from simulation if internal user tries to sign out in simulation mode.

      return hpe_logOutUser()
        .catch( err => dispatch( errorDuringLogOut(err) ) )// The same 'errorDuringLogin' action can handle the error for LogOut
        .then(ssoReinitialize(env, config.defaultIdp, config.defaultScope)) // Reset login params back to default when the user logs out.
        .then(() => dispatch( userLoggedOut() ) );// This goes after the catch because we want it to work as a 'finally'
  };
}

export const updateUserInfo = () => (dispatch,getState) => {
  var doAsUser = getState().userInit.userSimulation.simulatedUser;
  dispatch( getUserInfo(false, false, false, true, doAsUser) );
}

export const updateWatchListCount = () => (dispatch,getState) => {
  var doAsUser = getState().userInit.userSimulation.simulatedUser;
  dispatch( getUserInfo(false, false, true, true, doAsUser) ); // update the full list to update count! Also update alerts for alert count in footer!!
}

// Terms & Conditions
export const userAcceptsTermsConditions = () => (dispatch, getState) => {
  window.localStorage.setItem('terms_and_conditions_accepted', true);
  dispatch( getUserTermsConditionsStatus() );
  dispatch({
    type: USER_ACCEPTS_TERMS_AND_CONDITIONS
  });

  // Let's do the whole initialization stuff
  // this includes pusher and user info.
  let { userHasSkippedOrDoneTutorial } = getState().userInit;
  if (userHasSkippedOrDoneTutorial)
    dispatch( userInitilize() );
}

export const userDeclindedTermsConditions = () => (dispatch) => {
  window.localStorage.removeItem('terms_and_conditions_accepted');
  dispatch( userLogout() );
  dispatch({
    type: USER_DECLINED_TERMS_AND_CONDITIONS
  });
}

export const simulateUser = (doAsUser) => (dispatch) => {
  dispatch( getUserInfo(false,
    true,
    true,
    true,
    doAsUser) );
}

export const exitSimulation = () => (dispatch) => {
 dispatch( setSimulationMode(false, 'null') );
 dispatch(userInitilize());
}

export const skipOrDone = () => (dispatch, getState) => {
  window.localStorage.setItem('skipped_or_completed_tutorial', true);
  dispatch({
    type: USER_SKIPPED_OR_COMPLETED_TUTORIAL
  });
  dispatch(userInitilize());
}

// Local reinitialize
function ssoReinitialize(env, idp, scope) {
    return new Promise((resolve, reject) => {
        //need to modify it, not to suggest use hard code here
        // disable sso because app id not support
        hpeLogin.initialize(env, idp, scope, (res) => {
            if (res) {
                //if ( res.status === "ok" ) {
                    return resolve(res);
                //}

                // There are different status still
                // needs extra handling for errors
            }

            reject({ status: 'error', code: 'PLUGIN_ERROR' });
        }); 
    });// new Promise
}

