import { simpleFetch } from '../scripts/ALget.js'

export const GET_MODAL = "GET_MODAL"
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE"
export const CLEAR_FAVORITES = "CLEAR_FAVORITES"

export const sendModal = (obj) => {
  return {
    type: GET_MODAL,
    payload: obj
  }
}

export const getModal = (id) => {
  return (dispatch) => {
      simpleFetch(id).then(data => {
          dispatch(sendModal(data))
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
