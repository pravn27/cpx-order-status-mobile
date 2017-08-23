import api from '../utils/apiCommunicator'
const initialState = { IsLoading: false, data: [] };

const userSavedSearchList = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_SEARCHLIST':
            return { IsLoading: true, data: action.recentSearchList }

        case 'LOADING_START':
            return { IsLoading: true, data: Object.assign([], state.data) };

        case 'LOADING_STOP':
            return { IsLoading: false, data: Object.assign([], state.data) };

        default:
            return state
    }
}

export default userSavedSearchList