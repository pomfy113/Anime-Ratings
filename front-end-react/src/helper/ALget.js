export function ALfetch(title, url){
    // I needed to clean the title if it has 2nd; Anilist is quirky like that
    return simpleFetch(url).then(data => {
        // If we're going to do a fetch, we might as well get the episode list
        return AnilistGrab(data.title_japanese).then(ALdata => {
            return [[ALdata, data.episode], data.title_japanese]
        }).then((data) => {
            // If we don't get data due to sequel weirdness
            if(data[0][0] !== null){
                return data[0]
            }
            // Else we do some clean-up
            else{
                const title = titleCleanup(data[1]);

                return AnilistGrab(title).then((ALdata) => {
                    return [ALdata, data.episode]
                })
            }
        })
    })
}

function titleCleanup(title){
    const sequel = title.search(/\dth|3rd|2nd/)
    return title.slice(0, sequel+1);
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
    const id = typeof url === "number" ? String(url) : url.split('/')[4];
    const api = `http://api.jikan.moe/anime/${id}/episodes`

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
