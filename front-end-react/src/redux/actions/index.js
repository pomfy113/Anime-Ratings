export const GET_MODAL = "GET_MODAL"
export const TOGGLE_FAVORITE = "ADD_FAVORITE"


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
