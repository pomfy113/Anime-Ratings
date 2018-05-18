import { LOADING_ON, LOADING_OFF } from '../actions'

const loadingReducer = (state = false, action) => {
  switch(action.type) {
    case LOADING_ON:
        return true;
    case LOADING_OFF:
        return false
    default:
      return false
  }

}


export default loadingReducer
