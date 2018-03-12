function MALfetchCAST(info){
    const id = typeof info === 'number' ? info : info.split('/')[4]
    console.log(id)
    const api = `http://api.jikan.me/anime/${id}/characters_staff`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
        alert('An error has happened!')
    });
}

function MALfetchEP(info){
    const id = typeof info === 'number' ? info : info.split('/')[4]
    const api = `http://api.jikan.me/anime/${id}/episodes`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
        alert('An error has happened!')
    });
}

function simpleFetch(url){
    return $.ajax({
        url: `/simpleMALscrape?url=${url}`,
        type: 'GET'
    }).done((data) => {
        return data
    }).fail(() => {
        console.log("Failed")
    });
}
