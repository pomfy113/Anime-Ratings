function MALfetch(url){
    // return $.ajax({
    //     url: `/MALscrape?url=${url}`,
    //     type: 'GET'
    // }).done((data) => {
    //     return data
    // }).fail(() => {
    //     console.log("Failed")
    // });

    const id = url.split('/')[4]
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
