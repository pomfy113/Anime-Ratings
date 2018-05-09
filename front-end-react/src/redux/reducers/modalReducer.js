import { GET_MODAL } from '../actions'

const modalReducer = (state = [], action) => {
  switch(action.type) {
    case GET_MODAL:
        console.log("!", state)
        return state
    default:
      return state
  }
}

export default modalReducer
