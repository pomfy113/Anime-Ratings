export const GET_MODAL = "GET_MODAL"
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE"
export const CLEAR_FAVORITES = "CLEAR_FAVORITES"

export const getModal = (id) => {
  return {
    type: GET_MODAL,
    payload: { id }
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
