import { simpleFetch, ALfetch } from '../scripts/ALget.js'

export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = "HIDE_MODAL"
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE"
export const CLEAR_FAVORITES = "CLEAR_FAVORITES"
export const MAKE_VISIBLE = "MAKE_VISIBLE"

export const LOADING_ON = "LOADING_ON"
export const LOADING_OFF = "LOADING_OFF"

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
        let MALdata;
        simpleFetch(id).then(data => {
          MALdata = data
          return data.title
        }).then(title => {
          return ALfetch(title)
        }).then(ALdata => {
          dispatch(showModal({MALdata, ALdata}));
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

// Loading
export const loadingOn = () => {
    return {
        type: LOADING_ON
    }
}

export const loadingOff = () => {
    return {
        type: LOADING_OFF
    }
}
