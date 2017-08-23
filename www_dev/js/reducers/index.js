import { combineReducers } from 'redux'
import userInit from './userReducer'
import userAlerts from './alertsReducer'
import userSavedSearchList from './savedSerachReducer'
import modalReducer from './modalReducer'
import watchList from './watchListReducer'
import advancedSearch from './advancedSearchReducer'
import device from './deviceReducer'
import pusherReducer from './pusherReducer'
import backReducer from './backReducer'
import keepResultReducer from './keepResultReducer'

const appReducer = combineReducers({
  userInit,
  userAlerts,
  userSavedSearchList,
  watchList,
  modalReducer,
  advancedSearch,
  device,
  pusherReducer,
  backReducer,
  keepResultReducer
})

export default appReducer
