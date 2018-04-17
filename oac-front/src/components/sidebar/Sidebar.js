import React from 'react';

export default class Sidebar extends React.Component {
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
                if(!genresCopy.includes(data)){
                    genresCopy.push(data);
                }
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
            return(
                <div className={`sidebar-cont ${this.state.visible ? 'show' : 'hide'}`}>
                    <div className={`sidebar-content ${this.state.tab}`}>
                        <Search
                            search={(name) => this.props.search(name)}
                            searchOnly={this.props.searchOnly}
                            searchHandle={this.props.handleSearch}
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
                            <div className="sidebar-search" onClick={() => this.showSidebar('search')}>Filter</div>
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
                    <h1>Search/Filter</h1>

                    <div className="search-anime">
                        <h2>Search</h2>
                        <input className="anime-search" onChange={(ev) => props.search(ev.target.value)}></input>
                        <button className={`anime-search-btn ${props.searchOnly ? 'active' : null}`}
                            onClick={() => props.searchHandle()}>Search</button>
                    </div>
                    <form>
                        <h2>Filter</h2>
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
