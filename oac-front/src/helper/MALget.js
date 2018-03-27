export function MALfetchCAST(info){
    const id = typeof info === 'number' ? info : info.split('/')[4]
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

export function MALfetchEP(info){
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

export function seasonGet(season, year){
    return fetch(`/season/${season.toLowerCase()}/${year}`, {
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((data) => {
        return data
    }).catch((err) => {
      console.log(err);
      alert('Error!')
    })


}
