import { MAKE_VISIBLE } from '../actions'

const visibilityReducer = (state = null, action) => {
  switch(action.type) {
    case MAKE_VISIBLE:
        return action.payload
    default:
      return state
  }

}


export default visibilityReducer
