import React from 'react';
import {seasonGet, animeSearch, MALcurrentGet} from './helper/MALget.js';
import {simpleFetch} from './helper/ALget.js';
import Card from './components/card/Card.js';
import Modal from './components/modal/Modal.js';
import Season from './components/season/Season.js';
import Sidebar from './components/sidebar/Sidebar.js';

import { connect } from 'react-redux';

// localStorage.clear()
// TODO: Reworking THIS WHOLE BIT in redux, please wait warmly!
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
            filter: {
                title: null,
                synopsis: null,
                studio: null,
            },
            genres: [],
            // What's showing?
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
    // Filter switches
    filterChange(content){
        this.setState({filter: content})
    }

    genreChange(content){
        this.setState({genres: content})
    }

    favoritesOnly(){
        this.setState({
            favoritesOnly: !this.state.favoritesOnly
        });
    }

    search(name){
        if(name.length < 3){
            alert('Please enter a longer search term! (>3 characters)')
        }
        else{
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
    }

    toggleLoading(){
        this.setState({ isLoading: !this.state.isLoading })
    }

    filter(animeList){
        const titleFilter = this.state.filter.title
        const synopFilter = this.state.filter.synopsis
        const prodFilter = this.state.filter.studio
        const genreFilter = this.state.genres

        return animeList.filter((card) => {
            const anime = card.props.anime
            const genres = card.props.genres

            const producers = card.props.producers
            const title = anime.title
            const descrip = anime.synopsis || anime.description

            // Set from fastest to slowest
            // Exit 1 - if r18
            if(anime.r18_plus !== undefined && anime.r18_plus !== this.state.r18){
                return false
            }
            // Exit 2 - title
            if(title && titleFilter && !title.toLowerCase().includes(titleFilter)){
                return false
            }
            // Exit 3 - description
            if(descrip && synopFilter && !descrip.toLowerCase().includes(synopFilter)){
                return false
            }
            // Exit 4 - producers
            if(producers && prodFilter && !producers.some(prod => prod.toLowerCase().includes(prodFilter))){
                return false;
            }
            // Exit 5 - genres
            if(genres && genreFilter && !genres.some(genre => genre.includes(genreFilter))){
                return false;
            }

            return true
        })
    }

    render() {
        let source, filteredAnime;
        if(this.state.favoritesOnly){
            source = this.props.favorites
        }
        else{
            source = this.state.anime
        }

        if(source){
            const allAnime = source.map((anime) => {
                return <Card key={anime.title} anime={anime} handleModal={(i) => this.showModal(i)}
                    genres={anime.genre ? anime.genre.map(g => { return g.name }) : null}
                    producers={anime.producer ? anime.producer.map((producer) => {return producer.name}) : []}/>
            })

            filteredAnime = this.filter(allAnime)
        }

        const modal = this.props.modal
        ? <Modal data={this.props.modal}
            toggleLoading={() => this.toggleLoading()}
            handleClick={(ev) => this.handleWindowPress(ev)}
            handleKey={(ev) => this.handleKeyPress(ev)}
            newModal={(ev) => this.changeModal(ev)}
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
                    handleFilter={(i) => this.filterChange(i)}
                    handleGenre={(i) => this.genreChange(i)}
                    favoritesOnly={() => this.favoritesOnly()}
                />

                {seasons}
                {modal}
                {filteredAnime ? filteredAnime : <Loading/>}
            </div>
        );
            }
        }

function Loading(props){
    return(
        <div className="loading">
            <img className="loadingImage" alt="Loading!" src="../../images/TamamoBall4.gif"/>
            <div className="loadingText">LOADING!</div>
        </div>
    )
}

const mapStateToProps = (state) => {
  return {
      favorites: state.favorites,
      modal: state.modal,
      visible: state.visible
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps())(App)
