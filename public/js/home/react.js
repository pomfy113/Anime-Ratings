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
                    <div className="anime-score">{this.props.anime.score}</div>
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

    render(){
        let currentTab;
        switch(this.state.tab){
            case "synopsis":
                currentTab = <Synopsis
                                synopsis={this.state.MALdata.synopsis}
                                trailer={this.state.ALdata ? this.state.ALdata.trailer : null}
                                />
                break;
            case "cast":
                currentTab = <Cast
                                characters={this.state.MALcast.characters}
                                staff={this.state.MALcast.staff}
                                themes={this.state.MALcast.themes}
                                />
                break;
            case "episodes":
                currentTab = <Episodes
                                episodes={this.state.MALepisodes}
                                />
                break;
            case "related":
                currentTab = <Related
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
                    <ModalBar MALdata={this.props.data} ALdata={this.state.ALdata}/>
                    <Tabs handleTab={(tab, info) => this.tabSwitch(tab, info)}/>
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
    return(
        <div className="window-tabs">
            <div className="tab-synopsis" onClick={() => props.handleTab('synopsis', null)}>Story</div>
            <div className="tab-characters" onClick={() => props.handleTab('cast', 'MAL')}>Cast</div>
            <div className="tab-episodes" onClick={() => props.handleTab('episodes', 'MAL')}>Eps.</div>
            <div className="tab-related" onClick={() => props.handleTab('related', 'MAL')}>Related</div>
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
            visible: false,
            filter: this.props.current, // has title and synopsis
            genres: []
        }
    }

    componentDidMount(){
        document.addEventListener("click", (ev) => {
            if(!document.querySelector('.sidebar-cont').contains(ev.target)){
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
        let search = this.state.filter;
        search[type] = data.target.value;

        this.setState({filter: search});
        this.props.handleFilter(this.state.filter);
    }

    changeGenres(ele, type){
        let genres = this.state.genres.slice();
        // We're actually passing in the select box's data
        var newGenre = ele.options[ele.selectedIndex].value;
        if(type === 'add'){
            genres.includes(newGenre) ? null : genres.push(newGenre);
        }
        else if(type === 'remove'){
            genres.includes(newGenre) ? genres.pop(newGenre) : null;
        }
        this.setState({genres: genres})
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
                        currentGenres={this.state.genres}
                        changeGenres={(data, type) => this.changeGenres(data, type)}/>
                    <Favorites/>
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
    const allGenres = genres.map((genre) => {
        return (<option key={genre} value={genre}>{genre}</option>)
    });

    const ele = document.querySelector('.genre-select');

    return (
        <div className="genre-cont side-content">
            <h1>Genre</h1>
            <select className="genre-select" size='6'>
                {allGenres}
            </select>
            <button onClick={() =>
                props.changeGenres(document.querySelector('.genre-select'), 'add')
            }/>
            <button onClick={() =>
                props.changeGenres(document.querySelector('.genre-select'), 'remove')
            }/>

        </div>
    )
}
function Favorites(props){
    return (<div className="favorite-cont side-content">Wait warmly!</div>)
}

// ================================================================
// ================================================================
// ================================================================

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres  // All genres
        this.state = {
            current: this.props.genres,   // Currently turned on genres
            showGenres: false,
            modal: null,
            filter: {
                title: null,
                synopsis: null,
                studio: null,
            }
        }

        // All items
        this.allAnime = this.props.data.map((anime) =>{
            return <Card
                key={anime.title}
                anime={anime}
                genres={anime.genres}
                handleModal={(i) => this.showModal(i)}/>
        })
    }

    // * * * * * * * * * * * * * * * * * * * * * * * *
    // Genre switches
    // * * * * * * * * * * * * * * * * * * * * * * * *

    // Switch individual genres on or off
    genreShift(i){
        const current = this.state.current.slice();
        current[i] = current[i] ? null : this.genres[i];  // Toggle

        this.setState({
            current: current
        })
    }

    // Switch all
    allShift(i){
        switch(i){
            case "all":
                this.setState({ current: this.genres });
                break;
            case "none":
                this.setState({ current: [] })
                break;
        }
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
    }

    // * * * * * * * * * * * * * * * * * * * * * * * *
    // Filter switches
    // * * * * * * * * * * * * * * * * * * * * * * * *
    filterChange(content){
        this.setState({
            filter: content
        })
    }

    render() {
        // Post category filtering; uses state
        const filterTypes = ['title', 'synopsis', 'studio']
        const currentFilter = this.state.filter

        const filtered = this.allAnime.filter((card) => {
            // Faster access
            const anime = card.props.anime
            let check = true;

            for(let index in filterTypes){
                const filter = filterTypes[index]
                // If null, we don't have to worry
                if(currentFilter[filter]){
                    // Simple if searching synopsis or title
                    if(filter !== 'studio' && !anime[filter].includes(currentFilter[filter])){
                        check = false;
                        break;
                    }
                    // If it's a studio, we need to check the whole array
                    else
                    if(filter === 'studio' && !anime.producers.some(studio => studio.includes(currentFilter[filter]))){
                        check = false;
                        break;
                    }
                }
            }

            // Early exit 1
            if(check === false){
                return false
            }

            let genres = card.props.genres.some(genre => this.state.current.includes(genre))


            return genres;
        })

        // const genres =
        //                 <Genres
        //                     key="genrebox"
        //                     allGenres={this.genres}
        //                     currentGenres={this.state.current}
        //                     clickHandler={(i) => this.genreShift(i)}
        //                     clickHandlerAll = {(i) => this.allShift(i)}
        //                 />

        const modal = this.state.modal
                        ? <Modal data={this.state.modal}
                            handleClick={(ev) => this.handleWindowPress(ev)}
                            handleKey={(ev) => this.handleKeyPress(ev)}
                            newModal={(ev) => this.changeModal(ev)}
                            />
                        : null;

        return (
            <div key="container" className="Container">
                <Sidebar current={this.state.filter} handleFilter={(i) => this.filterChange(i)}/>
                {modal}
                <div className="btnCont">
                    <button className="genreToggle" onClick={() => this.setState({showGenres: !this.state.showGenres})}>
                        Toggle Genre Filter
                    </button>
                    {this.state.showGenres ? genres : null}
                </div>
                {filtered}
            </div>
        );
    }
}

ReactDOM.render(
    <App genres={genres} data={data}/>,
    document.getElementById('root')
);
