// +++++++++++++++++
//    Imports
// +++++++++++++++++
import { userLostInternetConnection, userRecoveredInternetConnection, userSessionRecovered, userLogout } 
    from './userActions.js'

// ++++++++++++++++++++++
// Exported Action names
// ++++++++++++++++++++++
export const DEVICE_ONLINE = 'DEVICE_ONLINE';
export const DEVICE_OFFLINE = 'DEVICE_OFFLINE';
export const APP_READY = 'APP_READY';
export const APP_INITIALIZING = 'APP_INITIALIZING';
export const APP_RESUMING = 'APP_RESUMING';
export const APP_RESUMED = 'APP_RESUMED';

// ++++++++++++++++++++++
// Action exports
// ++++++++++++++++++++++
export const deviceLostInternetConnection = () => {
    return dispatch => {
        dispatch( userLostInternetConnection() );
        dispatch( deviceOffline() );
    };
}

export const deviceHasInternetConnection = () => {
    return dispatch => {
        dispatch( userRecoveredInternetConnection() );
        dispatch( deviceOnline() );
    };
}

export const resumeApp = () => {
    return dispatch => {

        dispatch( appResuming() );

        if (navigator.connection.type === Connection.NONE) {// This means no internet connection
            dispatch( appResumed() );
            dispatch( checkNetworkStatus() ); 
            return;
        }


        checkIfSessioStillActive()
            .then(res => dispatch( userSessionRecovered(res.userid, res.sessiontk, res.idpid) ))// Valid session
            .catch(() => dispatch( userLogout() ))// Invalid session
            .then(() => {// This 'then' works like a 'finally'  
                dispatch( appResumed() );
                dispatch( checkNetworkStatus() );                
            });
    };
}

export const initializeApp = (env, idp, scope) => {
    return dispatch => {
    
        dispatch( appInitializing() );
    
        ssoInitialize(env, idp, scope)
            .then(res => dispatch( userSessionRecovered(res.userid, res.sessiontk, res.idpid) ))// Valid session
            .catch(() => dispatch( userLogout() ))// Invalid session
            .then(() => {// This 'then' works like a 'finally'  
                dispatch( appReady() );
                dispatch( checkNetworkStatus() );
            });
    };
}




// ++++++++++++++++++++++
// Internal Actions 
// ++++++++++++++++++++++

const deviceOnline = () => ({
    type: DEVICE_ONLINE
})


const deviceOffline = () => ({
    type: DEVICE_OFFLINE
})

const appInitializing = () => ({
    type: APP_INITIALIZING
})

const appResuming = () => ({
    type: APP_RESUMING
})

const appResumed = () => ({
    type: APP_RESUMED
})

const appReady = () => ({
    type: APP_READY
})

const checkNetworkStatus = () => {
    return dispatch => {
        // Checks for current network status  
        if ( navigator.connection.type !== Connection.NONE ) {
            dispatch( deviceHasInternetConnection() );
        } else {
            dispatch( deviceLostInternetConnection() );
        }

    };
}



// ++++++++++++++++++++++
// Utils
// ++++++++++++++++++++++
function ssoInitialize(env, idp, scope) {
    return new Promise((resolve, reject) => {
        //need to modify it, not to suggest use hard code here
        // disable sso because app id not support
        hpeLogin.initialize(env, idp, scope, (res) => {
            if (res) {
                if ( res.status === "ok" ) {
                    return resolve(res);
                }

                // There are different status still
                // needs extra handling for errors
                return reject(res);
            }

            reject({ status: 'error', code: 'PLUGIN_ERROR' });
        }); 
    });// new Promise
}

export const checkIfSessioStillActive = () => {
    return new Promise((resolve, reject) => {
        // Call API ==> will call callback function "loginInitDone" when done
        hpeLogin.checkSession((res) => {
            
            if (res) {
                if ( res.status === "ok" ) {
                    return resolve(res);
                }

                // There are different status still
                // needs extra handling for errors
                return reject(res);
            }

            reject({ status: 'error', code: 'PLUGIN_ERROR' });
        });
    });// new Promise
}