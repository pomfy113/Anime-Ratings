var airing = true;
var year = "2017";
var season;
var page = 1;

// For the overlay; showing score AND date for now
$('body').on('mouseenter', '.card-container', function() {
    // $(this).next().show()
    let next_airing = $(this).find("#airing-time").data('date')
    // $(this).find("#airing").html(moment(next_airing).calendar())

    // Let's get the time to be more exact
    const now = moment()
    const exp =  moment(next_airing)
    const time = moment.duration(exp.diff(now));

    let days = time.days()+"d "
    let hours = time.hours()+"h "
    let minutes = time.minutes()+"m "

    let timeToAir = days+hours+minutes

    $(this).find("#airing").html(timeToAir)


    if(!$(this).find("#MALscore").html()){
        $(this).find("#MALscore").html("Loading!")
        let name = encodeURIComponent($(this).data("name"))

        $.ajax({
            url: `/getrating/MAL/${name}`,
            type: 'GET'
        }).done((score) => {
            $(this).find("#MALscore").html(score + "%")
        }).fail(() => {
            $(this).find("#MALscore").html("MAL score unavailable")
        });
    }
})


// Filter button
$('body').on('click', '.genre-show', (e) => {
    $(".genre-filter").slideToggle()
})


// Modals
$('body').on('click', '.card', function(e) {
    let url = "/" + $(this).data('id')
    $('.loading-modal').show()
    $.ajax({
        url: "/modal"+url,
        type: 'GET'
    }).done((data) => {
        // Need this to remove scrolling
        $("body").addClass("modal-open");
        $('.loading-modal').hide()

        // Data -> modal
        $('.modalcontent').html(data)
        $(".mymodal").fadeIn("400")
    }).fail(() => {
        console.log("Failed")
    });
})

// Modal remove
$('body').on('click', '.closemodal', function(e) {
    $("body").removeClass("modal-open")
    $('.mymodal').hide()
    $('.modalcontent').html("")
})
// Hide if you click outside too
$('body').on('click', '.mymodal', function(e) {
    var target = e.target;
    if (jQuery(target).is('.mymodal')){
        $("body").removeClass("modal-open")
        $('.mymodal').hide()
        $('.modalcontent').html("")
    }
})

// Next page
$('body').on('click', '.next-page', function(e) {
    let sorting = "score"
    $('.loading').show()
    let genres = genrelist();
    season = $('#season-drop').val()
    page += 1
    $("#page").html(`Page: ${page}`)

    $.ajax({
        url: `/home-sort/${sorting}/${season}/${year}/${page}/${genres}`,
        type: 'GET'
    }).done((data) => {
        if(!data){
            $('.loading').hide()
            showerror("No more pages available")
            page -= 1
            return
        }
        else{
            showdata(data)
        }
    }).fail(() => {
        console.log("Failed")
    });
})

$('body').on('click', '.prev-page', function(e) {
    if(page - 1 < 1){
        showerror("Cannot go past first page")
        return
    }
    let sorting = "score"
    $('.loading').show()
    let genres = genrelist();
    season = $('#season-drop').val()
    page -= 1
    $("#page").html(`Page: ${page}`)

    $.ajax({
        url: `/home-sort/${sorting}/${season}/${year}/${page}/${genres}`,
        type: 'GET'
    }).done((data) => {
        showdata(data)
    }).fail(() => {
        console.log("Failed")
    });
})

// === === === === === ===
// === === SORTING === ===
// === === === === === ===

// Sort by score or popularity
$('body').on('click', '.main-filters > *', function(e) {
    let sorting = $(this).data('id')
    $('.loading').show()
    let genres = genrelist();
    season = $('#season-drop').val();
    page = 1;
    $("#page").html(`Page: ${page}`)

    $.ajax({
        url: `/home-sort/${sorting}/${season}/${year}/${page}/${genres}`,
        type: 'GET'
    }).done((data) => {
        showdata(data)
        if(season === "airing"){
            $('.title-container').children("h1").html(`Currently Airing`)
        }
        else{
            $('.title-container').children("h1").html(`${season}, ${year.substring(0,4)}`)
        }
        $('.title-container').children("h3").html(`Sorted by ${sorting}`)
        $('#sort-drop').html(`&#9660; ${capitalize(sorting)}`)
    }).fail(() => {
        console.log("Failed")
    });

})

// === === === === === ===
// === ===  DATING === ===
// === === === === === ===
// Back to airing stuff!

// All airing; default to score without dates
$('body').on('click', '#airing', function(e) {
    $('.loading').show()
    airing = true
    let genres = genrelist();
    $('#season-drop').html("Season")
    $('#season-drop').val('airing')
    season = "airing"
    page = 1
    $("#page").html(`Page: ${page}`)

    $.ajax({
        url: `/home-sort/score/${season}/${year}/${page}/${genres}`,
        type: 'GET'
    }).done((data) => {
        if(!data){
            $('#home-container').html("<h1>Nothing here!</h1>")
            $('.loading').hide()
        }
        else{
            showdata(data)
            $('.title-container').children("h1").html("Currently Airing")
            $('.title-container').children("h3").html("Sorted by score")
            $('#sort-drop').html("&#9660; Score")
        }

    }).fail(() => {
        console.log("Failed")
    });
})

$('body').on('click', '.season-buttons > .dropdown-item', function(e) {
    season = $(this).data('id')
    $('#season-drop').html(season)
    $('#season-drop').val(season)
    console.log($('#season-drop').val())
})

// When you click on the searching button
$('body').on('click', '#search', function(e) {
    year = $('#year-input').val()
    season = $('#season-drop').val()
    let genres = genrelist()
    page = 1
    $("#page").html(`Page: ${page}`)


    if(!jQuery.isNumeric(year) || !year){
        $('#season-drop').attr('data-season', season)
        showerror("Year required for search")
        return
    }

    $('.loading').show()

    $.ajax({
        url: `/home-sort/score/${season}/${year}/${page}/${genres}`,
        type: 'GET'
    }).done((data) => {
        if(!data){
            $('#home-container').html("<h1>Nothing here!</h1>")
            $('.loading').hide()
        }
        else{
            showdata(data)
        }

        if(season === "airing"){
            $('.title-container').children("h1").html(`Currently Airing`)
        }
        else{
            $('.title-container').children("h1").html(`${season}, ${year.substring(0,4)}`)
        }
        $('.title-container').children("h3").html("Sorted by score")
        $('#sort-drop').html("&#9660; Score")
    }).fail(() => {
        console.log("Failed")
    });
})

// For clicking on prequels
$('body').on('click', '#prequel', function(e) {
    let url = "/" + $(this).data('id')
    $('.loading-modal').show()
    $.ajax({
        url: "/modal"+url,
        type: 'GET'
    }).done((data) => {
        $('.loading-modal').hide()
        $('.modalcontent').html(data)
        $('.modalcontent').fadeIn(400)

    }).fail(() => {
        console.log("Failed")
    });
})

// For clicking on sequels
$('body').on('click', '#sequel', function(e) {
    let url = "/" + $(this).data('id')
    $('.loading-modal').show()

    $.ajax({
        url: "/modal"+url,
        type: 'GET'
    }).done((data) => {
        $('.loading-modal').hide()
        $('.modalcontent').html(data)
        $('.modalcontent').fadeIn(400)
    }).fail(() => {
        console.log("Failed")
    });
})

// === === === === === ===
// === === FILTERS === ===
// === === === === === ===

$("body").on('click', '.clear-all', (e) => {
    $('input[type="checkbox"]:checked').prop('checked',false);
})

function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
}

function genrelist(){
    let genrelist = "genres?q="
    $('.genre-filter').find('input:checked').each(function () {
        genrelist += ($(this).attr('rel') + ",")
    });
    return genrelist.slice(0, -1)

}
function showdata(data){
    $('#home-container').fadeOut(200)
    $('.loading').hide()
    $('#home-container').html(data)
    $('#home-container').fadeIn(200)
}

function showerror(string){
    $('.loading-error').show()
    $('.loading-error').html(string)
    return setTimeout(function(){$('.loading-error').fadeOut(400); return}, 2000);
}
