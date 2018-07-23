export function ALfetch(title){
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
    const api = `https://api.jikan.moe/anime/${url}/episodes`
    console.log(api)
    const options = { method: 'GET' };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        if(data.error){
            return backupSimpleFetch(url)
        }
        else{
            return data
        }
    }).catch((err) => {
        console.log(err)
        alert('Could not get MAL episode info!')
    });
}

function backupSimpleFetch(url){
    const api = `https://api.jikan.moe/anime/${url}`
    const options = { method: 'GET' };

    return fetch(api, options).then((res) => {
        return res.json()
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
    });
}
