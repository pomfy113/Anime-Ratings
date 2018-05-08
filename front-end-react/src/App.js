import React from 'react';
import {seasonGet, animeSearch, MALcurrentGet} from './helper/MALget.js';
import {simpleFetch} from './helper/ALget.js';
import Card from './components/card/Card.js';
import Modal from './components/modal/Modal.js';
import Season from './components/season/Season.js';
import Sidebar from './components/sidebar/Sidebar.js';

// TODO: Change to redux in branch, removing a lot functions pass-down bloat
// If switching to Jikan, can remove a LOT of conditionals.

localStorage.clear();
function Loading(props){
    return(
        <div className="loading">
            <img className="loadingImage" alt="Loading!" src="../../images/TamamoBall4.gif"/>
            <div className="loadingText">LOADING!</div>
        </div>
    )
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres  // All genres
        this.state = {
            anime: null,
            season: null,
            searchOnly: false,
            favoritesOnly: false,
            r18: false,
            favorites: [],
            filter: {
                title: null,
                synopsis: null,
                studio: null,
            },
            genres: [],
            // What's showing?
            modal: null,
            isLoading: false,

            search: ''
        }

    }

    componentWillMount(){
        return MALcurrentGet().then((data) => {
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
        if(this.state.isLoading){
            return
        }

        this.setState({isLoading: true})
        seasonGet(season, year).then((data) => {
            return data
        }).then((data) => {
            this.setState({
                anime: typeof data === 'string' ? JSON.parse(data) : data,
                season: {
                    year: year,
                    season: season
                },
                searchOnly: false,
                isLoading: false
            })
        })

    }

    // * * * * * * * * * * * * * * * * * * * * * * * *
    // Modal switches
    // * * * * * * * * * * * * * * * * * * * * * * * *

    changeModal(url){
        this.setState({ isLoading: true })
        this.hideModal()
        this.showModal(url);
    }

    showModal(url){
        this.setState({ isLoading: true })

        document.body.style.overflow = "hidden"
        document.body.style.marginRight = "5px"

        simpleFetch(url).then((data) => {
            this.setState({modal: data, isLoading: false})
        })
    }

    handleWindowPress(ev){
        if(ev.target.className === 'window-container'){
            this.hideModal()
            this.setState({ isLoading: false })

        }
    }

    handleKeyPress(ev){
        if(ev.key === 'Escape'){
            this.hideModal()
        }
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
        this.setState({
            favoritesOnly: !this.state.favoritesOnly
        });
    }

    search(name){
        this.setState({ isLoading: true })
        animeSearch(name).then((data) => {
            this.setState({
                anime: data,
                searchOnly: true,
                favoritesOnly: false,
                isLoading: false
            })
        });
    }

    toggleLoading(){
        this.setState({ isLoading: !this.state.isLoading })
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
            let filterTypes;
            if(this.state.searchOnly){
                filterTypes = ['title', 'synopsis']
            }
            else{
                filterTypes = ['title', 'synopsis', 'studio', 'r18']
            }

            const allAnime = source.map((anime) =>{
                // Post category filtering; uses state
                const producers = anime.producer.map((producer) => {
                    return producer.name
                })

                return <Card
                    key={anime.title}
                    anime={anime}
                    producers={producers}
                    genres={anime.genres}
                    handleModal={(i) => this.showModal(i)}/>
                })

                const currentFilter = this.state.filter

                filtered = allAnime.filter((card) => {
                    // Faster access
                    const anime = card.props.anime;
                    const producers = card.props.producers;
                    let check = true;

                    // TODO: This is just a mess. I'll have to clean this up.
                    for(let index in filterTypes){
                        const filter = filterTypes[index]
                        // If null, we don't have to worry

                        // Easy exit - no lewd
                        if(anime.r18_plus !== this.state.r18){
                            return false
                        }

                        if(currentFilter[filter]){
                            const data = currentFilter[filter].toLowerCase();
                            // Edge case: Anime full search requires us to search for 'description' instead

                            if(filter === 'synopsis' && this.state.searchOnly && anime.description
                              && !anime.description.toLowerCase().includes(data)){
                                check = false;
                                break;
                            }
                            // Simple if searching synopsis or title
                            else
                            if(filter !== 'studio' && anime[filter] && !anime[filter].toLowerCase().includes(data)){
                                check = false;
                                break;
                            }
                            // If it's a studio, we need to check the whole array
                            else
                            if(filter === 'studio' && producers
                              && !producers.some(studio => studio.toLowerCase().includes(data))){
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
                toggleLoading={() => this.toggleLoading()}
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
                isSeason={!this.state.searchOnly && !this.state.favoritesOnly}
                handleSeason={(i, j) => this.dataChange(i, j)}
                loading={this.state.isLoading}
              />
            : null;
            return (
                <div key="container" className="Container">
                    <button id='r18' className={`${this.state.r18 ? 'active' : 'inactive'}`}
                        onClick={() => this.setState({ r18: !this.state.r18 })}>
                        R-18
                    </button>
                    {this.state.isLoading ? <Loading/> : null}
                    <Sidebar
                        search={(value) => { this.setState({ search: value }) }}
                        handleSearch={() => this.search(this.state.search)}
                        searchOnly={this.state.searchOnly && !this.state.favoritesOnly}
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
                    {filtered ? filtered : <Loading/>}
                </div>
            );
            }
        }

export default App;
