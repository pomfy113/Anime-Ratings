import { SHOW_MODAL } from '../actions'
import { simpleFetch } from '../scripts/ALget.js'

const modalReducer = (state = null, action) => {
  switch(action.type) {
    case SHOW_MODAL:
        return action.payload
    default:
      return state
  }

}


export default modalReducer
