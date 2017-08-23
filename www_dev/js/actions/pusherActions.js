import pusher from '../utils/pusher';

export const PUSH_REGISTERED = 'PUSH_REGISTERED';
export const BACKGROUND_PUSH = 'BACKGROUND_PUSH';

export const pushAlreadyRegistered = () => ({
    type: PUSH_REGISTERED
})

export const appRunningInBackground = (isPaused) => ({
    type: BACKGROUND_PUSH,
    isPaused
})

export const registerPushAction = (response) => (dispatch, getState) => {
    console.log("inside pusher action!");
    if (!getState().userInit.userHasAcceptedTermsAndConditions)
        return;
    var _isPushRegistered = getState().pusherReducer.isPushRegistered;
    pusher.registerPush('Registering push after login', response, _isPushRegistered, dispatch, getState)
    .then(() => {
        console.log((_isPushRegistered ? "Push notification already registered!" : "Push notification device registration: Successful!"));
        dispatch(pushAlreadyRegistered());
    }).catch((error) => {
        console.log("Inside RegisterPush ErrorHandler : ", error);
    });
}

export const isAppPaused = (isPaused) => (dispatch) => {
    if (!isPaused) { 
        console.log ('app running in background: '+ isPaused); //keeping this so it pauses the state here...
        setTimeout(function(){  dispatch(appRunningInBackground(isPaused)); }, 3000); //500 millisecond wait to dispatch the app-resumed state 
    }
    else {
        dispatch(appRunningInBackground(isPaused));
    }
    
}