function MALfetch(title){
    $.ajax({
        url: `/MALscrape?url=${title}`,
        type: 'GET'
    }).done((data) => {
        return data
    }).fail(() => {
        console.log("Failed")
    });
}
