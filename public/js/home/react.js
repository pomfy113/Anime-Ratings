// Due to handlebars, it's a bit of an oddity
/*
const data = {{{MAL_TV}}}
ALfetch(title) handles fetching info from Anilist
*/

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

// ================================================================

function Genre(props) {
    return(
        <button className={`genreBtn ${props.isOn}`} onClick={props.onClick}>
            {props.text}
        </button>
    )
}

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
// ================================================================
// ================================================================
// ================================================================
function SynopsisTab(props){
    return (
        <div className="content-synopsis">{props.MALinfo.synopsis}</div>
    )
}

function ScoreTab(props){
    return (
        <div className="content-score">
            <p className="score-MAL">MyAnimeList: <br/>{props.MALinfo.score} out of 10</p>
            <p className="score-AL">Anilist/Anichart: <br/>{props.ALinfo.averageScore} out of 100</p>
        </div>
    )
}

function AiringTab(props){
    const currentTime = moment().format('MMMM Do YYYY, h:mma');
    const airingData = props.ALinfo.nextAiringEpisode
    let airingHTML;

    if(airingData){
        const episode = airingData.episode;
        const relativeTime = moment(airingData.airingAt * 1000).fromNow();

        airingHTML = (
            <p className="airing-day">
                As of {currentTime}, episode {episode} airs {relativeTime}.
            </p>
        )
    }
    else{
        airingHTML = (
            <p className="airing-day">
                This anime isn't airing. :(
            </p>
        )
    }

    return (
        <div className="content-airing">
            {airingHTML}
        </div>
    )
}

function Trailer(props){
    let url;

    switch(props.vid.site){
        case "dailymotion":
            url = `http://www.${props.vid.site}.com/embed/video/${props.vid.id}`
            break;
        case "youtube":
            url = `http://www.${props.vid.site}.com/embed/${props.vid.id}`
            break;
    }

    return (
        <div className="content-trailer">
            <iframe
                width="640"
                height="360"
                src={url}
                frameBorder="0"
                allowFullScreen>

            </iframe>
        </div>
    )
}

// ================================================================

class InfoBox extends React.Component {
    render(){
        let activeTab = <SynopsisTab MALinfo={this.props.MALinfo}/>;
        if(this.props.ALinfo){
            switch(this.props.tab){
                case 'synopsis':
                    activeTab = <SynopsisTab MALinfo={this.props.MALinfo}/>
                    break;
                case 'score':
                    activeTab = <ScoreTab MALinfo={this.props.MALinfo} ALinfo={this.props.ALinfo}/>
                    break;
                case 'airing':
                    activeTab = <AiringTab ALinfo={this.props.ALinfo}/>
                    break;
            }
        }

        return(
            <div className="MAL-info">
                <div className="MAL-buttons">
                    <div className="tab-synopsis" onClick={() => this.props.tabHandle('synopsis')}>Story</div>
                    <div className="tab-score" onClick={() => this.props.tabHandle('score')}>Score</div>
                    <div className="tab-airing" onClick={() => this.props.tabHandle('airing')}>Airing</div>
                    <div className="tab-trailer" onClick={() => this.props.tabHandle('trailer')}>Trailer</div>

                </div>
                <div className="MAL-infocontent">
                    {activeTab}
                </div>
            </div>
        )
    }
}


class Card extends React.Component {
    constructor(props){
        super(props)
        this.MALinfo = this.props.anime;

        this.state = {
            ALinfo: null,
            clicked: false,
            tab: 'synopsis',
            trailer: null,
            showTrailer: false
        }
    }

    grabALdata(tab){
        return ALfetch(this.MALinfo.title).then((data) => {
            this.setState({
                ALinfo: data,
                tab: tab,
                clicked: true,
                trailer: {id: data.trailer.id, site: data.trailer.site}
            })
        });
    }

    tabHandle(tab){
        if(!this.state.clicked){
            this.grabALdata(tab)
        }
        else{
            this.setState({tab: tab})
        }
    }

    trailerHandle(){
        if(!this.state.clicked){
            this.grabALdata(this.state.tab).then(() => {
                this.setState({showTrailer: !this.state.showTrailer})
            });
        }
        else{
            this.setState({showTrailer: !this.state.showTrailer})
        }

    }

    render() {
        const producers = this.MALinfo.producers.map((producer) => {
            return (
                <span key={`${this.MALinfo.title}-${producer}`} className="producer">
                    {producer}
                </span>
            )
        })

        return(
            <div className="MAL-container">
                {this.state.showTrailer ? <Trailer vid={this.state.trailer}/> : null}
                <button onClick={() => this.trailerHandle()}></button>
                <div className="MAL-title">
                    <div className="MAL-name"><h1>{this.MALinfo.title}</h1></div>
                    <div className="MAL-title-data">
                        <span className="MAL-producers">{producers}</span>
                        |
                        <span className="MAL-epnum">{this.MALinfo.nbEp != "?" ? this.MALinfo.nbEp + " eps" : "?" }</span>
                        |
                        <span className="MAL-source">{this.MALinfo.fromType}</span>
                    </div>
                </div>
                <img className="MAL-image" src={this.MALinfo.picture}></img>
                <InfoBox
                    MALinfo={this.MALinfo}
                    ALinfo={this.state.ALinfo}
                    tab={this.state.tab}
                    tabHandle={(i) => this.tabHandle(i)}
                />
            </div>
        )
    }
}
// ================================================================
// ================================================================
// ================================================================
// ================================================================

function Modal(props){
    return(
        <div className="modal">
            <div class="trailer-container">
                <iframe src={`http://www.youtube.com/embed/${this.props.videoid}`}
                frameborder="0" allowfullscreen></iframe>
            </div>
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
            current: this.props.genres   // Currently turned on genres
        }
    }

    genreShift(i){
        // Switch individual genres on or off
        const current = this.state.current.slice();

        // If it's in, nullify; otherwise, put it in as available again
        current[i] = current[i] ? null : this.genres[i];

        this.setState({
            current: current
        })
    }

    allShift(i){
        // Switch all on, or switch all off
        switch(i){
            case "all":
                this.setState({ current: this.genres });
                break;
            case "none":
                this.setState({ current: [] })
                break;
        }
    }

    render() {
        // All items
        const invList = this.props.data.map((anime) =>{
            return <Card key={anime.title} anime={anime} genres={anime.genres}/>
        })

        // Post category filtering; uses state
        const filtered = invList.filter((item) => {
            return item.props.genres.some(genre => this.state.current.includes(genre));
        })

        return (
            <div key="container" className="Container">
                <Genres
                    key="genrebox"
                    allGenres={this.genres}
                    currentGenres={this.state.current}
                    clickHandler={(i) => this.genreShift(i)}
                    clickHandlerAll = {(i) => this.allShift(i)}
                />
                {filtered}
            </div>
        );
    }
}

ReactDOM.render(
    <App genres={genres} data={data}/>,
    document.getElementById('root')
);
