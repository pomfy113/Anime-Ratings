import { TOGGLE_FAVORITE, CLEAR_FAVORITES } from '../actions'

const favoriteReducer = (state = [], action) => {
  const stateCopy = state.slice()

  switch(action.type) {
    case TOGGLE_FAVORITE:
        let favIndex = -1;
        state.forEach((item, index) => {
            if(action.payload.data.title === item.title){
                favIndex = index
            }
        })

        if(favIndex !== -1){
            stateCopy.splice(favIndex, 1)
            return stateCopy
        }
        else{
            stateCopy.push(action.payload.data)
            return stateCopy
        }
    case CLEAR_FAVORITES:
        return []
    default:
      return state
  }
}

export default favoriteReducer
