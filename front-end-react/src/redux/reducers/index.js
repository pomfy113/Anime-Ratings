import { combineReducers } from 'redux'

import modalReducer from './modalReducer.js'
import favoriteReducer from './favoriteReducer.js'

export default combineReducers({
  modal: modalReducer,
  favorites: favoriteReducer
})
