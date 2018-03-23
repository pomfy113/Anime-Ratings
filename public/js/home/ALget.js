function ALfetch(title, url){
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
            return AnilistGrab(simpleFetch(url).titleEnglish)
        }
    })


}

function AnilistGrab(title){
    var query = `
    query ($query: String) {
        Media (search: $query, type: ANIME) {
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
        return null;
    });
}
