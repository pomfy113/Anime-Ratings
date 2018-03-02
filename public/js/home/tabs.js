// I'm lazy
function getElement(id){
    return document.getElementById(id);
}

document.querySelectorAll('.MAL-buttons').forEach((div) => {
    div.onclick = function(e){
        const textBox = $(div.nextElementSibling);
        const type = e.srcElement.classList[0].split("-")[1];
        const tab = ".content-" + type;
        const title = textBox.data("title");
        let ALdata;

        if(!ALdata){
            tabGet(title).then((data) =>{
                ALdata = data;  // For saying that we got the info already
                console.log(data)
                $(textBox).find(".score-AL").html(`Anilist: ${data.averageScore} / 100`)
                // data.nextAiringEpisode.airingAt
                console.log(data.nextAiringEpisode)

                if(data.nextAiringEpisode){
                    const currentTime = moment().format('MMMM Do YYYY, h:mma');
                    const tilAir = moment(data.nextAiringEpisode.airingAt * 1000).fromNow();
                    const episode = data.nextAiringEpisode.episode;
                    const string = `As of ${currentTime}, episode ${episode} airs ${tilAir}`
                    $(textBox).find(".airing-day").html(string)
                }
                else{
                    $(textBox).find(".airing-day").html("This anime is currently not airing!")
                }

            })
        }

        tabGet("Cowboy Bebop").then((data) => {
            console.log(data)
        })

        // Show only the proper tab
        textBox.find(tab).css("display", "block")
        textBox.children().not(tab).css("display", "none")
    }
})

function tabGet(title){
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

function tabScore(el, title){

}
