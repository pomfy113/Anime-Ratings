import { simpleFetch } from '../scripts/ALget.js'

export const SHOW_MODAL = "SHOW_MODAL"
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE"
export const CLEAR_FAVORITES = "CLEAR_FAVORITES"

export const showModal = (obj) => {
  return {
    type: SHOW_MODAL,
    payload: obj
  }
}

export const getModal = (id) => {
  return (dispatch) => {
      simpleFetch(id).then(data => {
          dispatch(showModal(data))
      })
  }
}

export const toggleFavorite = (data) => {
  return {
    type: TOGGLE_FAVORITE,
    payload: { data }
  }
}

export const clearFavorites = (data) => {
  return {
    type: CLEAR_FAVORITES
  }
}
