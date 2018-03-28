import React from 'react';
import {seasonGet} from './helper/MALget.js';
import {simpleFetch} from './helper/ALget.js';
import Card from './Card.js';
import Modal from './Modal.js';
import Season from './Season.js';
import Sidebar from './Sidebar.js';


// DEBUGGING
// localStorage.clear()

function Loading(props){
    return(
        <img alt="Loading!" src="../../images/TamamoBall4.gif"/>
    )
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.genres = this.props.genres  // All genres
        this.state = {
            anime: null,
            season: null,
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
            const contentType = data.headers.get("content-type");
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
        simpleFetch(url).then(data => {
            this.showModal(data)
        })
    }

    showModal(data){
        document.body.style.overflow = "hidden"
        document.body.style.marginRight = "5px"
        this.setState({modal: data})

    }

    handleWindowPress(ev){
        if(ev.target.className === 'window-container'){
            this.hideModal()
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

            const loadingText = (
                    <div class="error-react">
                        <h1>Loading React!</h1>
                        <p>If it's not working, your browser might not support React.</p>
                    </div>)
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
                    {filtered ? filtered : loadingText}
                </div>
            );
            }
        }

export default App;
