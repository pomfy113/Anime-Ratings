import React from 'react';
import {MALfetchCAST, MALfetchEP, seasonGet} from './helper/MALget.js'
import {ALfetch, simpleFetch} from './helper/ALget.js'
import moment from 'moment'
import Card from './Card.js'
import Modal from './Modal.js'

// ================================================================
//               All genre-button related stuff
// ================================================================
// Due to handlebars, it's a bit of an oddity
/*
const data = {{{MAL_TV}}}
ALfetch(title) handles fetching info from Anilist
*/
// DEBUGGING
// localStorage.clear()


// ================================================================
// ================================================================
// MAIN COMPONENT: MODAL
// ================================================================
// ================================================================

// ================================================================
// ================================================================
// MAIN COMPONENT: Sidebar
// ================================================================
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
            // Click anywhere else to close sidebar
            document.addEventListener("click", (ev) => {
                const container = document.querySelector('.sidebar-cont');
                // The span appears to be finnicky
                if(!container.contains(ev.target) && ev.target.className !== 'genre-on'){
                    this.hideSidebar();
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
            // On clear, make it empty
            if(type === 'clear'){
                return this.props.handleGenre([])
            }

            let genresCopy = this.props.genres;

            // On add, add in the select box's data
            if(type === 'add'){
                genresCopy.includes(data) ? null : genresCopy.push(data);
            }
            // Else, find index and remove
            else if(type === 'remove'){
                if(genresCopy.includes(data)){
                    let index = genresCopy.indexOf(data);
                    genresCopy.splice(index, 1);
                }
            }

            // Send back to update current filter
            this.props.handleGenre(genresCopy);
        }

        removeFavorites(data){
            let favoritesCopy = this.props.favorites;
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

        // * * * * * * * * * * * * * * * * * * * *
        // SUBCOMPONENT: Each sidetab
        // * * * * * * * * * * * * * * * * * * * *

        // Searching via text
        function Search(props){
            return (
                <div className="search-cont side-content">
                    <h1>Search</h1>
                    <form>
                        <label htmlFor="search-name">Title</label>
                            <input id="search-name" onChange={(ev) => props.changeFilter(ev, 'title')}></input>
                        <label htmlFor="search-studio">Studio</label>
                            <input id="search-studio" onChange={(ev) => props.changeFilter(ev, 'studio')}></input>
                        <label htmlFor="search-content">Content</label>
                            <input id="search-content" onChange={(ev) => props.changeFilter(ev, 'synopsis')}></input>
                    </form>
                </div>
            )
        }

        // Filter via genre
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

        // Filter via favorites
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

    changeSeason(season, year){
        this.setState({
            currentSeason: {
                season: season,
                year: year
            }
        })
        this.props.handleSeason(this.seasons[season], year)
    }

    render(props){
        const seasons = this.selection.map((season) => {
            // Anime is weird when it comes to dates
            // Winter season starts off the year, so we need to tweak this a bit
            const year = this.state.currentSeason.year + Math.floor((this.state.currentSeason.season + season) / 4);
            const seasonIndex = ((this.state.currentSeason.season + season) % 4 + 4) % 4;
            // 2018 + (4+1) or 5 / 4 is 1

            return(
                <div key={season}
                    onClick={() => this.changeSeason(seasonIndex, year)}
                    className={`season-select ${season === 0 ? 'current' : null}`}>
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

function Loading(props){
    return(
        <img src="../../images/TamamoBall4.gif"/>
    )
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres  // All genres
        this.state = {
            anime: null,
            season: this.props.season,
            current: this.props.genres,   // Currently turned on genres
            showGenres: false,
            favoritesOnly: false,
            favorites: [],
            filter: {
                title: null,
                synopsis: null,
                studio: null,
            },
            genres: [],
            // What's showing?
            modal: null,
            isLoading: false


        }

    }

    componentWillMount(){
        return fetch('/get-current', {method: 'GET'}).then((data) => {
            return data.json()
        }).then((data) => {
            const date = new Date()
            this.setState({
                anime: data,
                season: {
                    year: date.getFullYear(),
                    season: Math.floor(date.getMonth() / 3)
                }
            })
        })

    }


    dataChange(season, year){
        this.setState({isLoading: true})
        seasonGet(season, year).then((data) => {
            return data
        }).then((data) => {
            this.setState({
                anime: typeof data === 'string' ? JSON.parse(data) : data,
                season: {
                    year: year,
                    season: season
                }

            })
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
        let source, filtered;
        if(this.state.favoritesOnly){
            source = this.state.favorites
        }
        else{
            source = this.state.anime
        }

        if(source){
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

                filtered = allAnime.filter((card) => {
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
        }

            const modal = this.state.modal
            ? <Modal data={this.state.modal}
                favorites={this.state.favorites}
                handleClick={(ev) => this.handleWindowPress(ev)}
                handleKey={(ev) => this.handleKeyPress(ev)}
                newModal={(ev) => this.changeModal(ev)}
                handleFavorites={(i) => this.favoritesChange(i)}
            />
            : null;

            const seasons = this.state.season
            ? <Season
                season={this.state.season}
                handleSeason={(i, j) => this.dataChange(i, j)}
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
                    {seasons}
                    {modal}
                    {filtered ? filtered : null}
                </div>
            );
            }
        }

export default App;
