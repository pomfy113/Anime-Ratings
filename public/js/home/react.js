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


class InfoBox extends React.Component {
    constructor(props){
        super(props)
        this.MALinfo = this.props.anime;

        this.state = {
            ALinfo: null,
            clicked: false,
            tab: 'synopsis'
        }
    }

    tabHandle(tab){
        if(!this.state.clicked){
            ALfetch(this.MALinfo.title).then((ALdata) => {
                this.setState({ALinfo: ALdata, tab: tab, clicked: true})
            });
        }
        else{
            this.setState({tab: tab})
        }

    }

    render(){
        let activeTab = <SynopsisTab MALinfo={this.MALinfo}/>;
        if(this.state.ALinfo){
            switch(this.state.tab){
                case 'synopsis':
                activeTab = <SynopsisTab MALinfo={this.MALinfo}/>
                break;
                case 'score':
                activeTab = <ScoreTab MALinfo={this.MALinfo} ALinfo={this.state.ALinfo}/>
                break;
                case 'airing':
                activeTab = <AiringTab ALinfo={this.state.ALinfo}/>
                break;
            }
        }

        return(
            <div className="MAL-info">
                <div className="MAL-buttons">
                    <div className="tab-synopsis" onClick={() => this.tabHandle('synopsis')}>Story</div>
                    <div className="tab-score" onClick={() => this.tabHandle('score')}>Score</div>
                    <div className="tab-airing" onClick={() => this.tabHandle('airing')}>Airing</div>
                </div>
                <div className="MAL-infocontent">
                    {activeTab}
                </div>
            </div>
        )
    }
}


class Card extends React.Component {
    render() {
        const producers = this.props.anime.producers.map((producer) => {
            return (
                <span key={`${this.props.anime.title}-${producer}`} className="producer">
                    {producer}
                </span>
            )
        })


        return(
            <div className="MAL-container">
                <div className="MAL-title">
                    <div className="MAL-name"><h1>{this.props.anime.title}</h1></div>
                    <div className="MAL-title-data">
                        <span className="MAL-producers">{producers}</span>
                        |
                        <span className="MAL-epnum">
                            {this.props.anime.nbEp != "?" ?
                                this.props.anime.nbEp + " eps"
                                :
                                "?"
                            }
                        </span>
                        |
                        <span className="MAL-source">{this.props.anime.fromType}</span>
                    </div>
                </div>
                <img className="MAL-image" src={this.props.anime.picture}></img>
                <InfoBox anime={this.props.anime}/>
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
