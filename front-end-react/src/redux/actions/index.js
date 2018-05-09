export const GET_MODAL = "GET_MODAL"


export const getModal = (id) => {
  return {
    type: GET_MODAL,
    payload: { id }
  }
}
