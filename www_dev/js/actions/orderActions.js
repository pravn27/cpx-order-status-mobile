import apiCommunicator from '../utils/apiCommunicator';
import { hashHistory } from 'react-router';
import { setUserInitAction, userLoggedIn, updateUserInfo, userDeniedAccessRights, userLogout, userLostInternetConnection }
    from '../actions/userActions';

export const HIDE_COMMON_POPUP = 'HIDE_COMMON_POPUP'; 
export const DISPLAY_COMMON_POPUP = 'DISPLAY_COMMON_POPUP'; 

export const sendFeedback = (qtcuid, survey, message) => (dispatch, getState) => {
  apiCommunicator.sendOrderFeedback(qtcuid, survey)
      .then(response => {
        if (200 === response.statusCode) {
          dispatch(displayCommonPopup(message.titleId, message.messageId))
        }
        else
          dispatch(hashHistory.goBack());
      })
      .catch(() => dispatch(hashHistory.goBack()));
}

export const displayCommonPopup = (titleId, messageId) => ({
  type: DISPLAY_COMMON_POPUP,
  titleId,
  messageId
})

export const hideCommonPopup = () => ({
  type: HIDE_COMMON_POPUP
})
