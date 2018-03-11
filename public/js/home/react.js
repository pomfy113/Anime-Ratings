// Due to handlebars, it's a bit of an oddity
/*
const data = {{{MAL_TV}}}
ALfetch(title) handles fetching info from Anilist
*/


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

class Genres extends React.Component {
    renderCategory(item, index) {
        return <Genre
            key={index}
            text={item}
            isOn={this.props.currentGenres[index] ? "on" : "off" }
            onClick={() => this.props.clickHandler(index)}
        />
    }

    renderSpecial(item){
        return <SpecialGenre
            key={item}
            text={item === "all" ? "Select All" : "Deselect All"}
            onClick={() => this.props.clickHandlerAll(item)}
        />
    }

    render(){
        const genreButtons = this.props.allGenres.map((item, index) => {
            return this.renderCategory(item, index)
        })

        const specialButtons = [
            this.renderSpecial("all"),
            this.renderSpecial("none")
        ]

        return (
            <div>
                <div className="genre-container">{genreButtons}</div>
                <div className="genre-special">{specialButtons}</div>
            </div>
        )
    }
}

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

        this.MALdata = this.props.data
        this.grabALData()

        this.state = {
            tab: 'synopsis',
            ALdata: null,
            // Just for checking if MAL got stuff received
            MALgot: false,
            MALcast: null,
            MALepisodes: null,
            MALthemes: null,
            MALrelated: null
        }

    }

    componentDidMount(){
      document.addEventListener("keydown", (ev) => this.props.handleKey(ev));
    }

    componentWillUnmount(){
      document.removeEventListener("keydown", (ev) => this.props.handleKey(ev));
    }

    // This is heavy. Get this ONLY when necessary
    grabMALData(tab){
        switch(tab){
            case 'related':
            case 'cast':
                return MALfetchCAST(this.MALdata.link || this.MALdata.id).then((data) => {
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
                return MALfetchEP(this.MALdata.link || this.MALdata.id).then((data) => {
                    this.setState({
                        MALepisodes: data.episode,
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                })
                break;
        }
    }

    // Should hit this immediately; rather lightweight
    grabALData(){
        return ALfetch(this.MALdata.title).then((data) => {
            this.setState({
                ALdata: data
            })
        });
    }

    tabSwitch(tab, info){
        if(this.state[`MAL${tab}`] === null){
            this.grabMALData(tab).then(() => {
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
                currentTab = <Synopsis synopsis={this.MALdata.synopsis}/>
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
                    changeModal={(data) => this.props.newModal(data)}/>
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
            {props.synopsis}
        </div>
    )
}

function Cast(props){
    const characters = props.characters.map((char) => {
        const actors = char.voice_actor.map((actor) => {
            // API pls.
            return(
                <div key={`${actor.name.replace("&#039;", "'")}`} className="actor">
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
                <div key={`${type}-${index}`} className={`related-anime ${anime.type}`}
                    onClick={anime.type === 'anime'
                        ? () => props.changeModal(anime.url)
                        : () => location.href = `${anime.url}`}>
                    <div className="related-anime-title">
                        {anime.title.replace("&#039;", "\'")}
                    </div>
                    <div className="related-anime-type">
                        {anime.type === 'anime' ? anime.type.toUpperCase() : 'MANGA/NOVEL (external link)'}
                    </div>
                </div>
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
    const episodes = props.episodes.map((ep) => {
        return(
            <tr>
                <td>{ep.id}</td>
                <td>
                    <p>{ep.title}</p>
                    <p>{ep.title_japanese}</p>
                </td>
                <td>{ep.aired}</td>
                <td>{ep.filler ? 'Y' : 'N'}</td>
                <td>{ep.recap ? 'Y' : 'N'}</td>
                <td><a href={ep.video_url}>LINK</a></td>
                <td><a href={ep.forum_url}>LINK</a></td>
            </tr>
        )
    })

    return(
        <div>
            <table className="content content-episodes">
                <tbody>
                    <tr>
                        <th>Ep. #</th>
                        <th>Title</th>
                        <th>Air Date</th>
                        <th>Filler?</th>
                        <th>Recap?</th>
                        <th>Video (MAL)</th>
                        <th>Forum (MAL)</th>
                    </tr>
                    {episodes}
                </tbody>
            </table>
        </div>
    )
}





// ================================================================
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
            modal: null
        }

        // All items
        this.fullList = this.props.data.map((anime) =>{
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

    render() {
        // Post category filtering; uses state
        const filtered = this.fullList.filter((item) => {
            return item.props.genres.some(genre => this.state.current.includes(genre));
        })

        const genres =
            <Genres
                key="genrebox"
                allGenres={this.genres}
                currentGenres={this.state.current}
                clickHandler={(i) => this.genreShift(i)}
                clickHandlerAll = {(i) => this.allShift(i)}
            />

        const modal = this.state.modal
                        ? <Modal data={this.state.modal}
                            handleClick={(ev) => this.handleWindowPress(ev)}
                            handleKey={(ev) => this.handleKeyPress(ev)}
                            newModal={(ev) => this.changeModal(ev)}
                            />
                        : null;

        return (
            <div key="container" className="Container">
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
