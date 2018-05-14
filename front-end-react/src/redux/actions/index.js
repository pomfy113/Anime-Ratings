import { simpleFetch } from '../scripts/ALget.js'

export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = "HIDE_MODAL"
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE"
export const CLEAR_FAVORITES = "CLEAR_FAVORITES"
export const MAKE_VISIBLE = "MAKE_VISIBLE"


// Modals
export const showModal = (obj) => {
    return {
        type: SHOW_MODAL,
        payload: obj
    }
}

export const hideModal = () => {
    return {
        type: HIDE_MODAL
    }
}

export const getModal = (id) => {
    return (dispatch) => {
        simpleFetch(id).then(data => {
            dispatch(showModal(data))
        })
    }
}

// Current visible
export const makeVisible = (type) => {
    return {
        type: MAKE_VISIBLE,
        payload: type
    }
}

// Favorites

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
