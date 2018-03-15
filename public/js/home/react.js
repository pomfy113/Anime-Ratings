// Due to handlebars, it's a bit of an oddity
/*
const data = {{{MAL_TV}}}
ALfetch(title) handles fetching info from Anilist
*/
// DEBUGGING


// ================================================================
//               All genre-button related stuff
// ================================================================
const genres = [
    "Action", "Adventure", "Cars", "Comedy", "Dementia",
    "Demons", "Mystery", "Drama", "Ecchi", "Fantasy", "Game",
    "Historical", "Horror", "Magic", "Martial Arts",
    "Mecha", "Music", "Parody", "Samurai", "Romance",
    "School", "Sci-Fi", "Shoujo", "Shoujo Ai", "Shounen",
    "Shounen Ai", "Space", "Sports", "Super Power", "Vampire",
    "Harem", "Slice of Life", "Supernatural", "Military", "Police",
    "Psychological", "Thriller", "Seinen", "Josei"
]

// Regular genres
function Genre(props) {
    return(
        <button className={`genreBtn ${props.isOn}`} onClick={props.onClick}>
            {props.text}
        </button>
    )
}

// For the "All" and "None" or any future bits
function SpecialGenre(props) {
    return(
        <button className='genreBtn specialBtn' onClick={props.onClick}>
            {props.text}
        </button>
    )
}

// class Genres extends React.Component {
//     renderCategory(item, index) {
//         return <Genre
//             key={index}
//             text={item}
//             isOn={this.props.currentGenres[index] ? "on" : "off" }
//             onClick={() => this.props.clickHandler(index)}
//         />
//     }
//
//     renderSpecial(item){
//         return <SpecialGenre
//             key={item}
//             text={item === "all" ? "Select All" : "Deselect All"}
//             onClick={() => this.props.clickHandlerAll(item)}
//         />
//     }
//
//     render(){
//         const genreButtons = this.props.allGenres.map((item, index) => {
//             return this.renderCategory(item, index)
//         })
//
//         const specialButtons = [
//             this.renderSpecial("all"),
//             this.renderSpecial("none")
//         ]
//
//         return (
//             <div>
//                 <div className="genre-container">{genreButtons}</div>
//                 <div className="genre-special">{specialButtons}</div>
//             </div>
//         )
//     }
// }

// ================================================================

class Card extends React.Component {
    constructor(props){
        super(props)
        this.producers = this.props.anime.producers.join(', ')
    }

    render() {
        return(
            <div className="anime-container"
                style={{backgroundImage: `url(${this.props.anime.picture})`}}
                onClick={() => this.props.handleModal(this.props.anime)}
                >
                <div className="anime-footer">
                    <div className="anime-title">{this.props.anime.title}</div>
                    <div className="anime-score">
                        {this.props.anime.score === '0' ? 'N/A' : this.props.anime.score}
                    </div>
                    <div className="anime-studio">{this.producers}</div>
                </div>
            </div>
        )
    }
}
// ================================================================
// ================================================================
// ================================================================
// ================================================================

class Modal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: this.props.data.id || this.props.data.link.split('/')[4],
            tab: 'synopsis',
            MALdata: this.props.data,
            ALdata: null,
            updateAt: null,
            // Just for checking if MAL got stuff received
            MALcast: null,
            MALepisodes: null,
            MALthemes: null,
            MALrelated: null
        }
    }


    componentDidMount(){
      document.addEventListener("keydown", (ev) => this.props.handleKey(ev));
      let loadstate = JSON.parse(localStorage.getItem(this.state.id));

      // If the file exists and a new episode hasn't aired,
      if(loadstate && (loadstate.updateAt > Date.now() || loadstate.updateAt === null)){
          loadstate.tab = 'synopsis';
          this.setState(loadstate);
      }
      // Else, let's start with a new object into local
      else{
          this.grabALData(this.state.MALdata.title, this.state.id).then(() => {
              localStorage.setItem(this.state.id, JSON.stringify(this.state))
          })
      }

    }

    componentWillUnmount(){
      document.removeEventListener("keydown", (ev) => this.props.handleKey(ev));
    }

    // Should hit this immediately; rather lightweight
    grabALData(title, animeID){
        return ALfetch(title).then((data) => {
            this.setState({
                ALdata: data,
                updateAt: (data.nextAiringEpisode ? data.nextAiringEpisode.airingAt * 1000 : null)
            });
        });

    }

    // This is heavy. Get this ONLY when necessary
    grabMALData(tab){
        switch(tab){
            case 'related':
            case 'cast':
                return MALfetchCAST(this.state.MALdata.link || this.state.MALdata.id).then((data) => {
                    this.setState({
                        MALcast: {
                            characters: data.character,
                            staff: data.staff
                        },
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                })
                break;
            case 'episodes':
                return MALfetchEP(this.state.MALdata.link || this.state.MALdata.id).then((data) => {
                    this.setState({
                        MALepisodes: data.episode,
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                })
                break;
        }

    }

    tabSwitch(tab, info){
        if(this.state[`MAL${tab}`] === null){
            this.grabMALData(tab).then(() => {
                localStorage.setItem(this.state.id, JSON.stringify(this.state))
                this.setState({tab: tab})
            })
        }
        else{
            this.setState({tab: tab})
        }
    }

    changeFavorites(){
        let favoritesCopy = this.props.favorites;
        let data = this.state.MALdata;
        let inArray = false;
        let index = -1;

        favoritesCopy.forEach((item) => {
            if(data.title === item.title){
                index = favoritesCopy.indexOf(item);
            }
        })

        if(index !== -1){
            favoritesCopy.splice(index, 1);
        }
        else{
            favoritesCopy.push(data)
        }

        return this.props.handleFavorites(favoritesCopy)
    }

    render(){
        let currentTab;
        switch(this.state.tab){
            case "synopsis":
                currentTab =    <Synopsis
                                    synopsis={this.state.MALdata.synopsis}
                                    trailer={this.state.ALdata ? this.state.ALdata.trailer : null}
                                />
                break;
            case "cast":
                currentTab =    <Cast
                                    characters={this.state.MALcast.characters}
                                    staff={this.state.MALcast.staff}
                                    themes={this.state.MALcast.themes}
                                />
                break;
            case "episodes":
                currentTab =    <Episodes
                                    episodes={this.state.MALepisodes}
                                />
                break;
            case "related":
                currentTab =    <Related
                                    related={this.state.MALrelated}
                                    changeModal={(data) => this.props.newModal(data)}
                                />
                break;
            default:
                currentTab = <div>?</div>
                break;
        }


        return(
            <div onClick={(i) => this.props.handleClick(i)} className="window-container">
                <div className="window-content">
                    <h1 className="window-title">{this.props.data.title}</h1>
                     <button onClick={() => this.changeFavorites()}>Test add</button>
                    <ModalBar MALdata={this.props.data} ALdata={this.state.ALdata}/>
                    <Tabs currentTab={this.state.tab} handleTab={(tab, info) => this.tabSwitch(tab, info)}/>
                    <Details currentTab={currentTab}/>
                </div>
            </div>
        )
    }
}


function AiringData(data){
    if(!data){
        return null;
    }

    const airingData = data.nextAiringEpisode;

    if(!airingData){
        return "N/A"
    }

    const day = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"]
    const episode = airingData.episode;
    const airAt = new Date(airingData.airingAt * 1000)

    const relativeTime = moment(airAt).fromNow();
    const exactDay = moment(airAt).format('MMMM Do, YYYY');
    const airingDay = day[airAt.getDay()] + "day"
    const airingHour = moment(airAt).format('h:mma')

    return {
        episode: episode,
        exactDay: exactDay,
        airingDay: airingDay,
        airingHour: airingHour,
        relativeTime: relativeTime
    }

}


function ModalBar(props){
    const producers = props.MALdata.studios ?
        props.MALdata.studios.join(', ') :
        props.MALdata.producers.join(', ');

    // The airing time is a nightmare
    const airingData = AiringData(props.ALdata)

    let airingDisplay;

    switch(airingData){
        case null:
            airingData && props.ALdata
                ? airingDisplay = "Loading!"
                : airingDisplay = "Anilist data not found!"
            break;
        case "N/A":
            airingDisplay = "Currently not airing :c";
            break;
        default:
            airingDisplay =
                <div className="bar-data-airing">
                    <div>Ep. {airingData.episode} {airingData.relativeTime}</div>
                    <div>{airingData.exactDay}</div>
                    <div>{airingData.airingHour}, {airingData.airingDay}s</div>
                </div>
            break;
    }

    return(
        <div className="window-bar">
            <img src={props.MALdata.picture}></img>

            <table className="bar-data">
                <tbody>
                    <tr>
                        <td>Studio:</td><td>{producers}</td>
                    </tr>
                    <tr>
                        <td>Source:</td><td>{props.MALdata.fromType || props.MALdata.source}</td>
                    </tr>
                    <tr>
                        <td>Eps:</td><td>{props.MALdata.nbEp || props.MALdata.episodes}</td>
                    </tr>
                    <tr>
                        <td>Score:</td><td>
                            <div>MAL - {props.MALdata.score} / 10.0</div>
                            <div>Ani - {props.ALdata ? props.ALdata.meanScore : "?"} / 100</div>
                        </td>
                    </tr>
                    <tr>
                        <td>Release:</td><td>{props.MALdata.releaseDate}</td>
                    </tr>
                    <tr>
                        <td>Airing:</td><td>{airingDisplay}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}
// * * * * * * * * * *
// * * * Textbox * * *
// * * * * * * * * * *

function Details(props){
    return(
        <div className="window-details">
            {props.currentTab}
        </div>
    )
}

function Tabs(props){
    const allTabs = ['synopsis', 'cast', 'episodes', 'related'];
    const tabNames = ['Story', 'Cast', 'Eps.', 'Related'];

    const tabs = allTabs.map((tab, index) => {
        const load = (tab === 'synopsis' ? null : 'MAL');           // Whether to load MAL or not
        const onTab = props.currentTab === tab                      // See if it's on
        const className = `tab-${tab} ` + (onTab ? 'on' : null);    // If on, add "on"

        return(<div key={tab} className={className} onClick={() => props.handleTab(tab, load)}> {tabNames[index]}</div>)
    });

    return(
        <div className="window-tabs">
            {tabs}
        </div>
    )
}


function Synopsis(props){
    return(
        <div className="content content-synopsis">
            <div className="synopsis-text">{props.synopsis}</div>
            <div className="synopsis-trailer">
                {props.trailer ? <Trailer site={props.trailer.site} url={props.trailer.id}/> : null}
            </div>
        </div>
    )
}

function Trailer(props){
    let url;

    switch(props.site){
        case "dailymotion":
            url = `http://www.${props.site}.com/embed/video/${props.url}`
            break;
        case "youtube":
            url = `http://www.${props.site}.com/embed/${props.url}`
            break;
        case null:
            return null

    }

    return (
        <iframe
            className="trailer-video"
            src={url}
            frameBorder="0"
            allowFullScreen>
        </iframe>
    )
}


function Cast(props){
    const characters = props.characters.map((char) => {
        const actors = char.voice_actor.map((actor, index) => {
            // API pls.
            return(
                <div key={`${actor.name.replace("&#039;", "'")}-${index}`} className="actor">
                    <div className="actor-name name"><a href={actor.url}>{actor.name}</a></div>
                    <div className="actor-language secondary">{actor.language}</div>
                    <img className="actor-image" src={actor.image_url}/>
                </div>
            )
        })

        return(
            <div key={`${char.name}`} className="content content-character">
                <div className="character">
                    <div className="character-name name"><a href={char.url}>{char.name}</a></div>
                    <div className="character-role secondary">{char.role}</div>
                    <img className="character-image" src={char.image_url}/>
                </div>
                <div className="actors">{actors}</div>
            </div>
        )
    })

    return(
        <div className="content content-cast">
            {characters}
        </div>
    )
}

function Related(props){
    let relationships = [];

    for(let type in props.related){
        // First let's grab everything inside this type of relation
        const reltype = props.related[type].map((anime, index) => {
            // ... and style the individual rows
            // Note: dammit, the API sends me apostrophe ASCII codes
            return(
                <a
                key={`${type}-${index}`}
                href={anime.type === 'manga' ? anime.url : null}
                onClick={anime.type === 'anime' ? () => props.changeModal(anime.url) : null}
                className="related-cont">
                    <div className={`related-anime ${anime.type}`}>
                        <div className="related-anime-title">
                            {anime.title.replace("&#039;", "\'")}
                        </div>
                        <div className="related-anime-type">
                            {anime.type === 'anime' ? anime.type.toUpperCase() : 'MANGA/NOVEL (external link)'}
                        </div>
                    </div>
                </a>
            )
        });
        // Now let's actually put it into the list of relationships
        relationships.push(
            (<div key={type} className="related-category">
                <h1 className="related-category-title">{type}</h1>
                {reltype}
            </div>)
        )
    }


    return(
        <div className="content content-related">
            {relationships}
        </div>
    )
}


function Episodes(props){
    if(!props.episodes || !props.episodes.length){
        return (<p>No episode data available </p>)
    }
    const episodes = props.episodes.map((ep) => {
        return(
            <tr key={ep.id} className="ep-row">
                <td className="eptable-id">{ep.id}</td>
                <td className="eptable-title">
                    <p className="eptitle-eng">
                        <a href={ep.video_url}>
                        {ep.title.replace("&#039;", "'")}
                        </a>
                    </p>
                    <p className="eptitle-jpn">{ep.title_japanese}</p>
                </td>
                <td className="eptable-air">{ep.aired}</td>
                <td className="eptable-filler">
                    {ep.filler ? 'Filler' : null}
                    {ep.filler && ep.recap ? '/' : null}
                    {ep.recap ? 'Recap' : null}</td>
                <td className="eptable-forum"><a href={ep.forum_url}>Link</a></td>
            </tr>
        )
    })

    return(
        <div>
            <table className="content content-episodes">
                <tbody>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Air Date</th>
                        <th></th>
                        <th>Forum</th>
                    </tr>
                    {episodes}
                </tbody>
            </table>
        </div>
    )
}





// ================================================================

class Sidebar extends React.Component {
    constructor(props){
        super(props);

        this.genres = [
            "Action", "Adventure", "Cars", "Comedy", "Dementia",
            "Demons", "Mystery", "Drama", "Ecchi", "Fantasy", "Game",
            "Historical", "Horror", "Magic", "Martial Arts",
            "Mecha", "Music", "Parody", "Samurai", "Romance",
            "School", "Sci-Fi", "Shoujo", "Shoujo Ai", "Shounen",
            "Shounen Ai", "Space", "Sports", "Super Power", "Vampire",
            "Harem", "Slice of Life", "Supernatural", "Military", "Police",
            "Psychological", "Thriller", "Seinen", "Josei"
        ]

        this.state = {
            tab: 'search', // default to this
            visible: false
        }
    }

    componentDidMount(){
        document.addEventListener("click", (ev) => {
            if(!ev.path.includes(document.querySelector('.sidebar-cont'))){
                this.hideSidebar()
            }
        });
    }

    showSidebar(tab){
        this.setState({visible: true, tab: tab})
    }

    hideSidebar(){
        this.setState({visible: false})
    }

    changeFilter(data, type){
        let search = this.props.filter;
        search[type] = data.target.value;

        this.props.handleFilter(search);
    }

    changeGenres(data, type){
        if(type === 'clear'){
            return this.props.handleGenre([])
        }

        let genresCopy = this.props.genres;
        // We're actually passing in the select box's data

        if(type === 'add'){
            genresCopy.includes(data) ? null : genresCopy.push(data);
        }
        else if(type === 'remove'){
            if(genresCopy.includes(data)){
                let index = genresCopy.indexOf(data);
                genresCopy.splice(index, 1);
            }
        }

        this.props.handleGenre(genresCopy);
    }

    removeFavorites(data){
        let favoritesCopy = this.props.favorites;
        let inArray = false;
        let index = -1;

        favoritesCopy.forEach((item) => {
            if(data.title === item.title){
                index = favoritesCopy.indexOf(item);
                favoritesCopy.splice(index, 1);
            }
        })

        return this.props.handleFavorites(favoritesCopy)
    }

    clearFavorites(){
        return this.props.handleFavorites([])
    }


    render(){
        let currentTab;
        return(
            <div className={`sidebar-cont ${this.state.visible ? 'show' : 'hide'}`}>
                <div className={`sidebar-content ${this.state.tab}`}>
                    <Search
                        changeFilter={(data, type) => this.changeFilter(data, type)}
                    />
                    <Genres
                        allGenres={this.genres}
                        currentGenres={this.props.genres}
                        changeGenres={(data, type) => this.changeGenres(data, type)}/>
                    <Favorites
                        removeFavorites={(data) => this.removeFavorites(data)}
                        favorites={this.props.favorites}
                        clearFavorites={() => this.clearFavorites()}
                        favoritesOnly={() => this.props.favoritesOnly()}
                    />
                </div>

                <div className="sidebar-btns">
                    <div className="sidebar-search" onClick={() => this.showSidebar('search')}>Search</div>
                    <div className="sidebar-genres" onClick={() => this.showSidebar('genre')}>Genres</div>
                    <div className="sidebar-favorites" onClick={() => this.showSidebar('favorite')}>Favorites</div>
                </div>
            </div>
        )
    }

}


function Search(props){
    return (
        <div className="search-cont side-content">
            <h1>Search</h1>
            <label>Title</label>
            <input className="search-name" onChange={(ev) => props.changeFilter(ev, 'title')}></input>
            <label>Studio</label>
            <input className="search-name" onChange={(ev) => props.changeFilter(ev, 'studio')}></input>
            <label>Content</label>
            <input className="search-name" onChange={(ev) => props.changeFilter(ev, 'synopsis')}></input>
        </div>
    )
}

function Genres(props){
    const allGenres = props.allGenres.map((genre) => {
        return (<option key={genre} value={genre}>{genre}</option>)
    });

    const ele = document.querySelector('.genre-select');

    const allCurrentGenres = props.currentGenres
            ?   props.currentGenres.map((genre) => {
                    return (<span className="genre-on" onClick={() => props.changeGenres(genre, 'remove')}>{genre}</span>)
                })
            :   null;

    return (
        <div className="genre-cont side-content">
            <h1>Genre</h1>
            <select
                onDoubleClick={() => props.changeGenres(ele.options[ele.selectedIndex].value, 'add')}
                className="genre-select" size='6'>
                {allGenres}
            </select>
            <div className="genre-btns">
                <div>
                    <button onClick={() => props.changeGenres(ele.options[ele.selectedIndex].value, 'add')}>Add</button>
                    <button onClick={() => props.changeGenres(ele.options[ele.selectedIndex].value, 'remove')}>Remove</button>
                </div>
                <button onClick={() => props.changeGenres(null, 'clear')}>Clear</button>

            </div>
            {allCurrentGenres}
        </div>
    )
}
function Favorites(props){
    let favorites = props.favorites.map((favorite) => {
        return(
            <div key={favorite.title} className="favorite-show" onClick={() => props.removeFavorites(favorite)}>
                {favorite.title}
            </div>
        )
    })
    return (
    <div className="favorite-cont side-content">
        <h1>Favorites</h1>
        <div className="favorite-btns">
            <button onClick={() => props.favoritesOnly()}>Toggle Favorites</button>
            <button onClick={() => props.clearFavorites()}>Clear All</button>
        </div>

        {favorites}
    </div>)
}

// ================================================================
// ================================================================
// ================================================================

class Season extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentSeason: this.props.season
        };
        this.seasons = ["Winter", "Spring", "Summer", "Fall"];
        this.selection = [-2, -1, 0, 1, 2]

    }

    render(props){
        // const seasons = this.seasons.map((season) => {
        //     return(
        //         <div key={season} className="season-select">{season}, {this.state.season.year}</div>
        //     )
        // })
        const seasons = this.selection.map((season) => {
            // Anime is weird when it comes to dates
            // Winter season starts off the year, so we need to tweak this a bit
            const year = this.state.currentSeason.year + Math.trunc((this.state.currentSeason.season - 3 + season ) / 4);
            const seasonIndex = ((this.state.currentSeason.season + season) % 4 + 4) % 4;

            return(
                <div key={season}
                    onClick={() => this.props.handleSeason(this.seasons[seasonIndex], year)}
                    className="season-select">
                    {this.seasons[seasonIndex]}, {year}
                </div>
            )

        })
        return(
            <div className="season-cont">
                {seasons}
            </div>
        )
    }
}
// ================================================================

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres  // All genres
        this.state = {
            anime: this.props.data,
            season: this.props.season,
            current: this.props.genres,   // Currently turned on genres
            showGenres: false,
            favoritesOnly: false,
            modal: null,
            favorites: [],
            filter: {
                title: null,
                synopsis: null,
                studio: null,
            },
            genres: []
        }

    }

    dataChange(season, year){
        seasonGet(season, year).then((data) => {
            return data
        }).then((data) => {
            this.setState({anime: typeof data === 'string' ? JSON.parse(data) : data})
        })
    }

    // * * * * * * * * * * * * * * * * * * * * * * * *
    // Modal switches
    // * * * * * * * * * * * * * * * * * * * * * * * *

    changeModal(url){
        this.hideModal()
        simpleFetch(url).then(data => this.showModal(data))
    }

    showModal(data){
        document.body.style.overflow = "hidden"
        document.body.style.marginRight = "5px"
        this.setState({modal: data})

    }

    handleWindowPress(ev){
        ev.target.className === 'window-container' ? this.hideModal() : null;
    }

    handleKeyPress(ev){
        ev.key === 'Escape' ? this.hideModal() : null;
    }

    hideModal(){
        this.setState({modal: null})
        document.body.style.overflow = "initial"
        document.body.style.marginRight = "0px"

    }

    // * * * * * * * * * * * * * * * * * * * * * * * *
    // Filter switches
    // * * * * * * * * * * * * * * * * * * * * * * * *
    filterChange(content){
        this.setState({filter: content})
    }

    genreChange(content){
        this.setState({genres: content})
    }

    favoritesChange(content){
        this.setState({favorites: content})
    }

    favoritesOnly(){
        this.setState({favoritesOnly: !this.state.favoritesOnly});
    }

    render() {
        let source;
        if(this.state.favoritesOnly){
            source = this.state.favorites
        }
        else{
            source = this.state.anime
        }

        const allAnime = source.map((anime) =>{
            return <Card
                key={anime.title}
                anime={anime}
                genres={anime.genres}
                handleModal={(i) => this.showModal(i)}/>
        })

        // Post category filtering; uses state
        const filterTypes = ['title', 'synopsis', 'studio']
        const currentFilter = this.state.filter

        const filtered = allAnime.filter((card) => {
            // Faster access
            const anime = card.props.anime
            let check = true;

            for(let index in filterTypes){
                const filter = filterTypes[index]

                // If null, we don't have to worry
                if(currentFilter[filter]){
                    const data = currentFilter[filter].toLowerCase()
                    // Simple if searching synopsis or title
                    if(filter !== 'studio' && !anime[filter].toLowerCase().includes(data)){
                        check = false;
                        break;
                    }
                    // If it's a studio, we need to check the whole array
                    else
                    if(filter === 'studio' && !anime.producers.some(studio => studio.toLowerCase().includes(data))){
                        check = false;
                        break;
                    }
                }
            }

            // Early exit 1
            if(check === false){
                return false
            }

            if(this.state.genres.length > 0){
                return card.props.genres.some(genre => this.state.genres.includes(genre))
            }
            else{
                return true
            }

        })

        const modal = this.state.modal
                        ? <Modal data={this.state.modal}
                            favorites={this.state.favorites}
                            handleClick={(ev) => this.handleWindowPress(ev)}
                            handleKey={(ev) => this.handleKeyPress(ev)}
                            newModal={(ev) => this.changeModal(ev)}
                            handleFavorites={(i) => this.favoritesChange(i)}
                            />
                        : null;

        return (
            <div key="container" className="Container">

                <Sidebar
                    filter={this.state.filter}
                    genres={this.state.genres}
                    favorites={this.state.favorites}
                    handleFilter={(i) => this.filterChange(i)}
                    handleGenre={(i) => this.genreChange(i)}
                    handleFavorites={(i) => this.favoritesChange(i)}
                    favoritesOnly={() => this.favoritesOnly()}
                />
                <Season
                    season={this.state.season}
                    handleSeason={(i, j) => this.dataChange(i, j)}/>
                {modal}
                {filtered}
            </div>
        );
    }
}

ReactDOM.render(
    <App genres={genres} data={data} season={season}/>,
    document.getElementById('root')
);
