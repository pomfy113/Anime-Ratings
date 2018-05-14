import { MAKE_VISIBLE } from '../actions'

const visibilityReducer = (state = 'anime', action) => {
  switch(action.type) {
    case MAKE_VISIBLE:
        if(state == 'favorites'){
            return 'anime'
        }
        else{
            return action.payload
        }
    default:
      return state
  }

}


export default visibilityReducer
