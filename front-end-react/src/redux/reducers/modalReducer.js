import { GET_MODAL } from '../actions'
import { simpleFetch } from '../scripts/ALget.js'

const modalReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_MODAL:
      return action.payload
    default:
      return state
  }

}


export default modalReducer
