import { GET_MODAL } from '../actions'
import { simpleFetch } from '../scripts/ALget.js'

const modalReducer = (state = [], action) => {
  switch(action.type) {
    case GET_MODAL:
        const data = simpleFetch(action.payload.id)

        setTimeout(function(){
            state = data
        }, 1000)
    default:
      return state
  }

}


export default modalReducer
