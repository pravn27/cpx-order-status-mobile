import { PUSH_REGISTERED, BACKGROUND_PUSH }
    from '../actions/pusherActions';

function setPushRegistered(state = false, { type }) {
    switch (type) {
        case PUSH_REGISTERED:
            return true;
        
        default:
            return state
    }
}

function setBackgroundMode(state = false, { type, isPaused }) {
    switch (type) {
        case BACKGROUND_PUSH:
            return isPaused;
        default:
            return state
    }
}

export const pusherReducer = (state = {}, action) => {

    return Object.assign({}, state,
        {
            isPushRegistered: setPushRegistered(state.isPushRegistered, action),
            isAppRunningInBackground: setBackgroundMode(state.isAppRunningInBackground, action) 
        }
    )
}

export default pusherReducer