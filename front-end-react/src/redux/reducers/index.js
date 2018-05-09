import { combineReducers } from 'redux'

import modalReducer from './modalReducer.js'

export default combineReducers({
  modal: modalReducer
})
