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

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres
        this.state = {
            current: this.props.genres
        }
        console.log(props)
    }

  render() {
      // All items
      // const invList = this.props.items.map((item) =>{
      //     return <Item key={item.id} name={item.name} price={item.price} category={item.category}/>
      // })

      // // Post category filtering; uses state
      // const filtered = invList.filter((item) => {
      //     return this.state.current.includes(item.props.category);
      // })


    return (
      <div className="Container">
          <Genres allGenres = {this.genres} currentGenres = {this.state.genres}/>
      </div>
    );
  }
}

ReactDOM.render(
    <App genres={genres}/>,
    document.getElementById('root')
);
