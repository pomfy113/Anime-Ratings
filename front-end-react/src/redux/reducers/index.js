import { combineReducers } from 'redux'

import modalReducer from './modalReducer.js'
import favoriteReducer from './favoriteReducer.js'
import visibilityReducer from './visibilityReducer.js'

export default combineReducers({
  modal: modalReducer,
  favorites: favoriteReducer,
  visible: visibilityReducer
})
