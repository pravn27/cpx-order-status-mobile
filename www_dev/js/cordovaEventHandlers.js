// +++++++++++++++++++++++++
//      Imports
// +++++++++++++++++++++++++
import ReactDOM from 'react-dom';
import { deviceLostInternetConnection, deviceHasInternetConnection, 
         resumeApp, initializeApp }
    from './actions/deviceActions';
import {isAppPaused} from './actions/pusherActions';
import config from './utils/config';

// +++++++++++++++++++++++++
//      Globals
// +++++++++++++++++++++++++
var 
    // Main Reactjs component to render
    AppBody,
    // This Dispatch function should NOT be used as 
    // a general purpose dispatch.
    // Remember that the actions should be dispatched
    // by a component or by another action.
    dispatch; // Used to connect with Redux

// +++++++++++++++++++++++++
//      Cordova Events
// +++++++++++++++++++++++++


// Bind Event Listeners
//
// Bind any events that are required on startup. Common events are:
// 'load', 'deviceready', 'offline', and 'online'.
const bindEvents = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', onResume, false); //when resume, check session valid or not
    document.addEventListener('pause', onPause, false);
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
}

const onDeviceReady = function() {
    if (typeof window.parent.ripple === "function") { cordovaHTTP = undefined; }
    window.open = cordova.InAppBrowser.open;
	//var env = config.getIsDebug() ? config.defaultStgEnv : config.defaultProEnv; //Use this when going to PROD
	var env = config.defaultStgEnv; // This is used during development and testing
    ReactDOM.render(AppBody, document.getElementById('content'));
    dispatch( initializeApp(env, config.defaultIdp, config.defaultScope) );
}

const onResume = function() {
    dispatch( resumeApp() );
    dispatch( isAppPaused(false) );
}

const onPause = function () {
    // hpeLogin.checkSession(app.loginPause);
    dispatch( isAppPaused(true) );
}

const onOnline = function() {
    dispatch( deviceHasInternetConnection() );
}

const onOffline = function() {
    dispatch( deviceLostInternetConnection() );
}

// ++++++++++++++++++
//     Exports
// ++++++++++++++++++

// Constructor
export const initializeEvents = function(mainReactComponent, dispatchFn) {
    AppBody = mainReactComponent;
    dispatch = dispatchFn; // Used to connect with Redux
    bindEvents();
}