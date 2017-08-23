import apiCommunicator from '../utils/apiCommunicator';

export const LoadingStartAction = () => ({ type: 'LOADING_START' })
export const LoadingStopAction = () => ({ type: 'LOADING_STOP' })
export const getAlertsAction = (alertList) => ({ type: 'GET_ALERTS', alertList })
export const discardAlertAction = (userAlerts, alertId) => ({ type: 'DISCARD_ALERT', alertId, userAlerts })

export const getAlerts = (alertList) => (dispatch, getState) => {
    dispatch(LoadingStartAction());
    dispatch(getAlertsAction(alertList));
    dispatch(LoadingStopAction());
}

export const discardAlert = (alertId) => (dispatch, getState) => {

    apiCommunicator.updateAlert(alertId, false)
        .then(response => {
            if (200 === response.statusCode) { }
            else
                dispatch(getAlerts());
        })
        .catch(() => dispatch(getAlerts()));
    ADB.trackAction('e.orderAlertRemove', {'alertId': alertId});
}

export const subscribeAlerts = (assetId, assetType, isAlertsSubscribed) => (dispatch, getState) => {
    apiCommunicator.alertOnWatchList(assetId, assetType, isAlertsSubscribed);
}
