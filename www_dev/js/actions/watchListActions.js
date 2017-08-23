import apiCommunicator from '../utils/apiCommunicator';
import { setUserInitAction, userLoggedIn, updateUserInfo, userDeniedAccessRights, userLogout, userLostInternetConnection }
    from '../actions/userActions';

// Globals
const defaultAssetType = 'com.hpe.prp.cpx.model.Order';


// Action type names
export const LOADING_START = 'LOADING_START';
export const LOADING_STOPPED = 'LOADING_STOP';
export const GET_WATCHLIST = 'GET_WATCHLIST';
export const GET_WATCHLIST_SORT = 'GET_WATCHLIST_SORT';
export const ORDER_REMOVED_FROM_WATCHLIST = 'ORDER_REMOVED_FROM_WATCHLIST';
export const ADD_NEW_TO_WATCHLIST = 'ADD_NEW_TO_WATCHLIST';
export const TOGGLE_SORT_ASCEND = 'TOGGLE_SORT_ASCEND';
export const RETAIN_FILTER = 'RETAIN_FILTER';
export const SORT_CRITERIA = 'SORT_CRITERIA';
export const FILTER_CRITERIA = 'FILTER_CRITERIA';
export const DEFAULT_SORT = 'DEFAULT_SORT';


// Internal actions
const LoadingStartAction = () => ({ type: LOADING_START })
const LoadingStopAction = () => ({ type: LOADING_STOPPED })
const getWatchListAction = (watchList,last_updated) => ({ type: GET_WATCHLIST, watchList, last_updated })
const getWatchListAfterSortAction = (watchList) => ({ type: GET_WATCHLIST_SORT, watchList })
const removeWatchListAction = (assetId) => ({ type: ORDER_REMOVED_FROM_WATCHLIST, assetId });



// Exported Actions
export const toggleSortAscend = () => ({ type: TOGGLE_SORT_ASCEND });
export const setRetainFilter = (flag) => ({ type: RETAIN_FILTER, flag });
export const setFilterCriteria = (criteria) => ({ type: FILTER_CRITERIA, criteria });
export const setDefaultSort = (flag) => ({ type: DEFAULT_SORT, flag });

export const getWatchList = (assetType = defaultAssetType) =>
    (dispatch, getState) => {
    var doAsUser = getState().userInit.userSimulation.simulatedUser;
    
    dispatch(LoadingStartAction());
    // dispatch(updateUserInfo());
    apiCommunicator.getWatchList(assetType,doAsUser)
        .then(response => {
            if (200 === response.statusCode) {
                dispatch(getWatchListAction(response.body.list,response.body.lastUpdatedDate));
            }
            dispatch(LoadingStopAction());
        })
        .catch(() => dispatch(LoadingStopAction()));
}

export const getWatchListAfterSort = (watchList) =>
    (dispatch, getState) => {

        dispatch(LoadingStartAction());
        dispatch(getWatchListAfterSortAction(watchList));
        dispatch(LoadingStopAction());
    }

export const removeWatchList = (assetId, assetType = defaultAssetType) => (dispatch, getState) => {

    dispatch(LoadingStartAction());

    apiCommunicator.removeWatchList(assetId) //DO NOT add "assetType" param here! merge issues might come here
        .then(response => {
            if (200 === response.statusCode) {
                dispatch(removeWatchListAction(assetId));
                dispatch(LoadingStopAction());
            }
            else
                dispatch(LoadingStopAction());
        })
        .catch(() => dispatch(LoadingStopAction()));
    
    // Remove watchlist item
    ADB.trackAction('e.orderWatchRemove', {'qtcuid': assetId} )
}

export const addWatchListToUserInit = (watchList) => ({
    type: ADD_NEW_TO_WATCHLIST,
    watchList
})