export function ALfetch(title, url){
    // I needed to clean the title if it has 2nd; Anilist is quirky like that
    let cleanedTitle;
    let sequel = title.search(/4th|3rd|2nd/)

    if(sequel !== -1){
        cleanedTitle = title.slice(0, sequel+1);
    }
    else{
        cleanedTitle = title;
    }

    // Define our query variables and values that will be used in the query request
    return AnilistGrab(cleanedTitle).then((data) => {
        if(data !== null){
            return data
        }
        else{
            // All else fails, do a full grab from MAL and use the Japanese title
            // Titles get finickey with OUs vs OOs, romanization, etc
            return backupMALfetch(url).then(data => {
                return AnilistGrab(data.title_japanese).then(ALdata => {
                    return [ALdata, data.episode]
                })
            })
        }
    })


}

function AnilistGrab(title){
    var query = `
    query ($query: String) {
        Media (search: $query, type: ANIME) {
            title {
              romaji
              english
              native
            }
            meanScore
            trailer{
                id
                site
            }
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
        }
    }`;

    const variables = {
        query: title
    };

    // Define the config we'll need for our Api request
    const url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    return fetch(url, options).then((res) => {
        if (res.status !== 200) {
            throw new Error("Not 200 response");
        }
        else{
            return res.json();
        }
    }).then((json) => {
        const data = json.data.Media
        return data
    }).catch((err) => {
        console.log(err)
        return null;
    });
}


export function simpleFetch(url){
    return fetch(`/simpleMALscrape?url=${url}`, {
      method: 'GET',
    }).then((data) => {
      return data.json();
    }).catch((err) => {
      console.log(err);
      alert('Could not perform modal fetch!')
    })
}

export function backupMALfetch(url){
    const id = url.split('/')[4]
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
