import { SHOW_MODAL, HIDE_MODAL } from '../actions'
import { simpleFetch } from '../scripts/ALget.js'

const modalReducer = (state = null, action) => {
  switch(action.type) {
    case SHOW_MODAL:
        console.log(action.payload)
        document.body.style.overflow = "hidden";
        document.body.style.marginRight = "5px";
        return action.payload;
    case HIDE_MODAL:
        document.body.style.overflow = "initial";
        document.body.style.marginRight = "0px";
        return null
    default:
      return state
  }

}


export default modalReducer
