import { DEVICE_ONLINE, DEVICE_OFFLINE, APP_READY, APP_INITIALIZING, APP_RESUMED, APP_RESUMING } 
    from '../actions/deviceActions';

function isOnline (state = true, { type }) {
    switch (type) {
        case DEVICE_ONLINE:
            return true;
        case DEVICE_OFFLINE:
            return false;
        default:
            return state;
    }
}

function isAppReady (state = false, { type }) {
    switch (type) {
        case APP_READY:
        case APP_RESUMED:
            return true;

        case APP_INITIALIZING:
        case APP_RESUMING:
            return false;

        default:
            return state;
    }
}

function appStatus (state = APP_INITIALIZING, { type }) {
    switch (type) {
        case APP_READY:
            return type;
        case APP_RESUMED:
        case APP_INITIALIZING:
        case APP_RESUMING:
            console.log(`App status changed to '${type}'!`);
            return type;

        default:
            return state;
    }
}


export const modalReducer = (state = {}, action) => {

    return Object.assign({}, state, 
        {
            isAppReady: isAppReady(state.isAppReady, action),
            appStatus: appStatus(state.appStatus, action),
            isOnline: isOnline(state.isOnline, action)
        }
    )
}

export default modalReducer