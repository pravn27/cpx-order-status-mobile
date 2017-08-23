import { MODAL_NAME as DENIED_ACCESS_RIGHTS_MODAL } from '../components/DeniedAccessRights'
import { MODAL_NAME as NO_INTERNET_CONNECTION_MODAL } from '../components/NoInternetConnection'
import { MODAL_NAME as NO_SERVICE_POPUP } from '../components/ServiceErrorPopup'
import { MODAL_NAME as COMMON_POPUP } from '../components/CommonPopup'
import { MODAL_NAME as EMAIL_NOT_AVAILABLE_MODAL } from '../components/EmailNotAvailablePopup'
import { USER_DENIED_ACCESS_RIGHTS, USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS, USER_LOST_INTERNET_CONNECTION,
         USER_RECOVERED_INTERNET_CONNECTION, USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION, USER_INIT,
         USER_HAS_NO_SERVICE, USER_ACKNOWLEDGE_NO_SERVICE, EMAIL_NOT_AVAILABLE, USER_ACK_EMAIL_NOT_AVAILABLE } 
    from '../actions/userActions';
import { DISPLAY_COMMON_POPUP, HIDE_COMMON_POPUP } from '../actions/contactActions';
import { removeClassModalParent } from '../utils/utilities';

function activeModal ( currentAtiveModal, { type, titleId, messageId }) {

    switch (type) {

        case USER_HAS_NO_SERVICE:
            return NO_SERVICE_POPUP;

        case DISPLAY_COMMON_POPUP:
            return COMMON_POPUP;
            
        case USER_DENIED_ACCESS_RIGHTS:
            return DENIED_ACCESS_RIGHTS_MODAL;
        
        case USER_LOST_INTERNET_CONNECTION:
            return NO_INTERNET_CONNECTION_MODAL;

        case EMAIL_NOT_AVAILABLE:
            return EMAIL_NOT_AVAILABLE_MODAL;

        case USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS:
        case USER_RECOVERED_INTERNET_CONNECTION:
        case USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION:
        case USER_ACKNOWLEDGE_NO_SERVICE:
        case USER_ACK_EMAIL_NOT_AVAILABLE:
        case HIDE_COMMON_POPUP:
            removeClassModalParent(); // to remove the css class that locks the background from scroll
            return null;
        
        default:
            return currentAtiveModal;
    }
}


function deniedAccessRightsModal (state = { }, { type, titleId = 'access_denied', messageId = 'access_denied' }) {

    switch (type) {
        case USER_DENIED_ACCESS_RIGHTS:
            return { titleId, messageId };

        default: 
            return state;
    }
}

function serviceErrorPopup (state = { }, { type, titleId = 'error', messageId = 'could_not_complete_request' }) {

    switch (type) {
        case USER_HAS_NO_SERVICE:
            return { titleId, messageId };

        default: 
            return state;
    }
}

function commonPopup (state = { }, { type, titleId = 'title', messageId = 'default_popup_message' }) {

    switch (type) {
        case DISPLAY_COMMON_POPUP:
            return { titleId, messageId };

        default: 
            return state;
    }
}

function noInternetConnPopUp (state = { }, { type, titleId = 'connectivity', messageId = 'you_lost_internet_connection' }) {

    switch (type) {
        case USER_LOST_INTERNET_CONNECTION:
            return { titleId, messageId };

        default: 
            return state;
    }
}

function emailNotAvailablePopup (state = { }, { type, titleId = 'email_not_available', messageId = 'email_not_available_message' }) {
    switch(type) {
        case EMAIL_NOT_AVAILABLE:
            return { titleId, messageId };

        default:
            return state;
    }
}

export const modalReducer = (state = {}, action) => {

    return Object.assign({}, state, 
        {
            activeModal: activeModal(state.activeModal, action),
            deniedAccessRightsModal: deniedAccessRightsModal(state.deniedAccessRightsModal, action),
            serviceErrorPopup: serviceErrorPopup(state.serviceErrorPopup, action),
            commonPopup: commonPopup(state.commonPopup, action),
            noInternetConnPopUp: noInternetConnPopUp(state.noInternetConnPopUp, action),
            emailNotAvailablePopup: emailNotAvailablePopup(state.emailNotAvailablePopup, action)
        }
    )
}

export default modalReducer
