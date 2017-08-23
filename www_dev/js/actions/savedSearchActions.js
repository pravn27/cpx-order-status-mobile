import apiCommunicator from '../utils/apiCommunicator';
import ServiceErrorPopup from '../components/ServiceErrorPopup';


export const LoadingStartAction = () => ({ type: 'LOADING_START' })
export const LoadingStopAction = () => ({ type: 'LOADING_STOP' })

export const getSavedSearchListAction = (recentSearchList) => ({ type: 'GET_SEARCHLIST', recentSearchList })

export const getSavedSearchList = () =>
    (dispatch, getState) => {
    var doAsUser = getState().userInit.userSimulation.simulatedUser;

        dispatch(LoadingStartAction());

        apiCommunicator.getRecentSearch(doAsUser)
            .then(response => {
                if (200 === response.statusCode) {
                    dispatch(getSavedSearchListAction(response.body.list));
                    dispatch(LoadingStopAction());
                }
                else
                    dispatch(LoadingStopAction());
            })
            .catch(() => dispatch(LoadingStopAction()));
    }

export const discardSavedSearchList = (searchId) => (dispatch, getState) => {

    apiCommunicator.deleteRecentSearch(searchId)
        .then(response => {
            if (200 === response.statusCode) { }
            else
                dispatch(getSavedSearchList());
        })
        .catch(() => dispatch(getSavedSearchList()));

}
