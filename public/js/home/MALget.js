function MALfetch(url){
    return $.ajax({
        url: `/MALscrape?url=${url}`,
        type: 'GET'
    }).done((data) => {
        return data
    }).fail(() => {
        console.log("Failed")
    });
}
