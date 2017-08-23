import api from '../utils/apiCommunicator'
const alertData = require('../../data/alertList.json');
const initialState = { IsLoading: false, data: [] };

const userAlerts = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALERTS':
            return { IsLoading: true, data: action.alertList };

        case 'DISCARD_ALERT':
            var alertsList = action.userAlerts
            var index = alertsList.findIndex(x => x.id == action.alertId);
            alertsList.splice(index, 1);
            return { IsLoading: true, data: Object.assign([], alertsList) };

        case 'LOADING_START':
            return { IsLoading: true, data: Object.assign([], state.data) };

        case 'LOADING_STOP':
            return { IsLoading: false, data: Object.assign([], state.data) };

        default:
            return state
    }
}

export default userAlerts
