export function MALfetchCAST(info){
    const id = typeof info === 'number' ? info : info.split('/')[4]
    const api = `https://api.jikan.moe/anime/${id}/characters_staff`

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
    const api = `https://api.jikan.moe/anime/${id}/episodes`

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
    const api = `https://api.jikan.moe/season/${year}/${season}/`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        let anime = data.season;
        for(let item in anime){
            const biggerpic = anime[item].image_url.replace('r/100x140/', '');
            anime[item].image_url = biggerpic;
        }
        return anime.sort(function(a, b){
             return b.score - a.score;
         })
    }).catch((err) => {
        console.log(err)
    });
}

export function animeSearch(name){
    const api = `https://api.jikan.moe/search/anime/${name}/`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        let anime = data.result;
        for(let item in anime){
            const biggerpic = anime[item].image_url.replace('r/100x140/', '');
            anime[item].image_url = biggerpic;
        }
        return anime
    }).catch((err) => {
        console.log(err)
    });
}

export function MALcurrentGet(){
    const currentDay = getDate();
    const year = currentDay[0];
    const season = currentDay[1];

    const api = `https://api.jikan.moe/season/${year}/${season}/`

    const options = {
            method: 'GET'
        };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        let anime = data.season;
        for(let item in anime){
            const biggerpic = anime[item].image_url.replace('r/100x140/', '');
            anime[item].image_url = biggerpic;
        }
        return anime.sort(function(a, b){
             return b.score - a.score;
         })
    }).catch((err) => {
        console.log(err)
    });
}

function getDate(){
    const date = new Date();
    const year = date.getFullYear();
    const seasonList = ["winter", "spring", "summer", "fall"];
    const seasonCount = Math.floor(date.getMonth() / 3);

    const season = seasonList[seasonCount];

    return [year, season, seasonCount]
}
