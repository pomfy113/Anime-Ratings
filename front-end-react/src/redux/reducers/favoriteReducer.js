import { TOGGLE_FAVORITE } from '../actions'

const favoriteReducer = (state = [], action) => {
  const stateCopy = state.slice()

  switch(action.type) {
    case TOGGLE_FAVORITE:
        let favIndex = -1;
        state.forEach((item, index) => {
            if(action.payload.data.title == item.title){
                favIndex = index
            }
        })

        if(favIndex !== -1){
            stateCopy.splice(favIndex, 1)
            console.log(stateCopy)
            return stateCopy
        }
        else{
            stateCopy.push(action.payload.data)
            console.log(stateCopy)
            return stateCopy
        }
    default:
      return state
  }
}

export default favoriteReducer
