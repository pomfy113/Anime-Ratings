function ALfetch(title){
    var query = `
    query ($query: String) {
        Media (search: $query, type: ANIME) {
            id
            averageScore
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

    // I needed to clean the title if it has 2nd; Anilist is quirky like that
    let cleanedTitle;
    if(title.search("2nd") !== -1){
        const index = title.indexOf("2nd") + 1;
        cleanedTitle = title.slice(0, index);
    }
    else{
        cleanedTitle = title;
    }


        // console.log(cleanedTitle, title)

    // Define our query variables and values that will be used in the query request
    const variables = {
        query: cleanedTitle
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
        return res.json()
    }).then((json) => {
        const data = json.data.Media
        console.log(json.data.Media.trailer)
        return data
    }).catch((err) => {
        alert('An error has happened!')
    });
}
