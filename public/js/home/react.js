// Due to handlebars, it's a bit of an oddity
// const data = {{{MAL_TV}}}
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

function Category(props) {
    return(
        <button>{props.value}</button>
    )
}


class Genres extends React.Component {
    renderCategory(item, index) {
        return <Category
            key={index}
            value={item}
        />
    }

    render(){
        const buttons = this.props.allGenres.map((item, index) => {
            return this.renderCategory(item, index)
        })

        return (
            <div>
                {buttons}
            </div>
        )
    }
}
// ================================================================
// ================================================================
// ================================================================
// ================================================================

class InfoBox extends React.Component {
    render(){
        return(
            <div className="MAL-summary">
                <div className="MAL-buttons">
                    <div className="tab-synopsis">Story</div>
                    <div className="tab-score">Score</div>
                    <div className="tab-airing">Airing</div>
                </div>
                <div className="MAL-content">
                    <div className="content-synopsis">{this.props.anime.synopsis}</div>
                    <div className="content-score">
                        <p className="score-MAL">MAL: {this.props.anime.score}</p>
                        <p className="score-AL">Anilist: LOADING</p>
                        <p className="score-KIT">Kitsu: LOADING</p>
                    </div>
                    <div className="content-airing">
                        <p className="airing-day">Loading!</p>
                    </div>
                </div>
        </div>
        )
    }
}


class Card extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            tab: 'synopsis'
        }
    }

  render() {
      // const {title, picture, synopsis, score} = this.props.anime;
    return(
        <div className="MAL-container">
            <div className="MAL-title">
                <div className="MAL-name"><h1>{this.props.anime.title}</h1></div>
                <div className="MAL-title-data">
                    <span className="producer"></span>
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
        this.genres = this.props.genres
        this.state = {
            current: this.props.genres
        }
    }

  render() {
      // All items
      const invList = this.props.data.map((anime) =>{
          return <Card key={anime.id} anime={anime}/>
      })

      // // Post category filtering; uses state
      const filtered = invList.filter((item) => {
          return this.state.current.includes(item.props.category);
      })


    return (
      <div className="Container">
          <Genres allGenres = {this.genres} currentGenres = {this.state.genres}/>
          {invList}
      </div>
    );
  }
}

ReactDOM.render(
    <App genres={genres} data={data}/>,
    document.getElementById('root')
);
