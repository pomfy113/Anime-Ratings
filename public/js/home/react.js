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
        exactDay: exactDay,
        airingDay: airingDay,
        airingHour: airingHour,
        relativeTime: relativeTime
    }


}


function ModalBar(props){
    const producers = props.MALdata.producers.join(', ')
    // The airing time is a nightmare
    const airingData = AiringData(props.ALdata)

    let airingDisplay;

    switch(airingData){
        case null:
            airingDisplay = "Loading!";
            break;
        case "N/A":
            airingDisplay = "Currently not airing :c";
            break;
        default:
            airingDisplay =
                <div className="bar-data-airing">
                    <div>{airingData.exactDay}</div>
                    <div>{airingData.airingHour}, {airingData.airingDay}s</div>
                    <div>Airs {airingData.relativeTime}</div>
                </div>
            break;
    }

    return(
        <div className="window-bar">
            <img src={props.MALdata.picture}></img>

            <table className="bar-data">
                <tbody>
                    <tr>
                        <th>Studio:</th><th>{producers}</th>
                    </tr>
                    <tr>
                        <th>Source:</th><th>{props.MALdata.fromType}</th>
                    </tr>
                    <tr>
                        <th>Eps:</th><th>{props.MALdata.nbEp}</th>
                    </tr>
                    <tr>
                        <th>MAL Score:</th><th>{props.MALdata.score}/10</th>
                    </tr>
                    <tr>
                        <th>AL Score:</th><th>{props.ALdata ? props.ALdata.meanScore : "Loading!"}</th>
                    </tr>
                    <tr>
                        <th>Airing:</th><th>{airingDisplay}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}

function Details(props){
    // <button onClick={() => props.handleTab()}>Test</button>

    return(
        <div className="modal-details">
            <div className="tab-bar">
                <div className="tab-synopsis" onClick={() => props.tabHandle('synopsis', null)}>Story</div>
                <div className="tab-characters" onClick={() => props.tabHandle('characters', 'MAL')}>Cast</div>
                <div className="tab-episodes" onClick={() => props.tabHandle('episodes', 'MAL')}>Eps.</div>
            </div>
        </div>
    )
}

class Modal extends React.Component {
    constructor(props){
        super(props)

        this.MALdata = this.props.data
        this.grabALData()

        this.state = {
            tab: 'synopsis',
            ALdata: null,
            MALepisodes: null,
            MALcharacters: null
        }

    }
    // This is heavy. Get this ONLY when necessary
    grabMALData(info){

    }

    // Should hit this immediately; rather lightweight
    grabALData(){
        ALfetch(this.MALdata.title).then((data) => {
            this.setState({
                ALdata: data
            })

        });
    }

    render(){
        return(
            <div onClick={(i) => this.props.handleClick(i)} className="window-container">
                <div className="window-content">
                    <h1 className="window-title">{this.props.data.title}</h1>
                    <ModalBar MALdata={this.props.data} ALdata={this.state.ALdata}/>
                    <Details handleTab={(tab, info) => this.grabData(tab, info)}/>
                </div>
            </div>
        )
    }
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

    showModal(data){
        document.body.style.overflow = "hidden"
        this.setState({modal: data})
    }

    hideModal(event){
        if(event.target.className === 'window-container'){
            document.body.style.overflow = "initial"
            this.setState({modal: null})
        }
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
                        ? <Modal data={this.state.modal} handleClick={(i) => this.hideModal(i)}/>
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
