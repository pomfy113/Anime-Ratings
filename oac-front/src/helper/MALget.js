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
        alert('Could not get MAL cast info!')
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
        alert('Could not get MAL episode info!')
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
      alert('Could not get seasonal info!')
    })
}

// export function animeSearch(name){
//     return fetch(`/search/${name}`, {
//         method: 'GET'
//     }).then((data) => {
//         return data.json();
//     }).then((data) => {
//         console.log("Incoming data: ", data)
//         return data
//     }).catch((err) => {
//       console.log(err);
//       alert('Could not get seasonal info!')
//     })
// }

export function animeSearch(name){
    const api = `http://api.jikan.me/search/anime/${name}/`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        let anime = data.result;
        console.log(anime, anime[0])
        for(let item in anime){
            const biggerpic = anime[item].image_url.replace('r/100x140/', '');
            anime[item].image_url = biggerpic;
        }
        return anime
    }).catch((err) => {
        console.log(err)
    });
}
