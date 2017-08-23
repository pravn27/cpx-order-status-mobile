import { USER_INFO_RECEIVED, FETCHING_USER_INFO_FAILED, FETCHING_USER_INFO, GET_USER_INIT, USER_AUTHENTICATING,
         USER_TRIES_TO_LOGIN, USER_LOGOUT, USER_LOGGED, GET_USER_TERMS_AND_CONDITIONS_STATUS,SIMULATION_MODE, USER_SKIPPED_OR_COMPLETED_TUTORIAL } 

    from '../actions/userActions';

function setUserData ( state, { type, userInfo }) {
    switch (type) {
        case USER_INFO_RECEIVED:
            return userInfo;

        default:
            return state
    }
}


function isUserInfoFetching ( state = false, { type }) {
    switch (type) {
        case FETCHING_USER_INFO:
            return true;

        case USER_INFO_RECEIVED:
        case FETCHING_USER_INFO_FAILED:
            return false;

        default:
            return state
    }
}

function isUserAuthenticating ( state = false, { type, flag }) {
    switch (type) {
        case USER_AUTHENTICATING:
            return flag;
        
        default:
            return state
    }
}

function isUserInfoReady ( state = false, { type }) {
    switch (type) {

        case USER_LOGOUT:
            return false;

        case USER_INFO_RECEIVED:
            return true;


        // If current is true then the data is ready (but maybe not updated)
        // If current is false, then the user info never was set
        default:
            return state
    }
}

function isUserLoggedin ( state = false, { type }) {
    switch (type) {
        case USER_LOGGED:
            return true;

        case USER_LOGOUT:
            return false;
        default:
            return state
    }
}

function isUserLoginReady ( state = false, { type }) {
    switch (type) {
        case USER_LOGGED:
        case USER_LOGOUT:
            return true;
        default:
            return state
    }
}

function userHasAcceptedTermsAndConditions ( state = false, { type, status }) {
    switch (type) {
        case GET_USER_TERMS_AND_CONDITIONS_STATUS:
            return status;

        default:
            return state
    }
}

function userAuthData ( state = {}, { type, authData }) {
    switch (type) {
        case USER_LOGGED:
            return authData;

        default:
            return state
    }
}

function setUserSimulation(state = {}, { type, userSimulation })
{
    switch(type) {
        case SIMULATION_MODE :
            return userSimulation ;
        
        default:
            return state

    }
}

function userHasSkippedOrDoneTutorial ( state = (null !== window.localStorage.getItem('skipped_or_completed_tutorial')), {type}) {
    switch (type) {
        case USER_SKIPPED_OR_COMPLETED_TUTORIAL:
            return true;
        default:
            return state
    }
}


export const userReducer = (state = {}, action) => {

    return Object.assign({}, state,
        {
            data: setUserData( state.data, action ),
            isUserLoggedin: isUserLoggedin( state.isUserLoggedin, action ),
            isUserLoginReady: isUserLoginReady( state.isUserLoginReady, action ),
            isUserInfoReady: isUserInfoReady( state.isUserInfoReady, action ),
            isUserInfoFetching: isUserInfoFetching( state.isUserInfoFetching, action ),
            isUserAuthenticating: isUserAuthenticating(state.isUserAuthenticating, action),
            userHasAcceptedTermsAndConditions: userHasAcceptedTermsAndConditions( state.userHasAcceptedTermsAndConditions, action ),
            userAuthData: userAuthData( state.userAuthData, action ),
            userSimulation : setUserSimulation( state.userSimulation, action),
            userHasSkippedOrDoneTutorial: userHasSkippedOrDoneTutorial( state.userHasSkippedOrDoneTutorial, action )

        }
    )
}

export default userReducer
