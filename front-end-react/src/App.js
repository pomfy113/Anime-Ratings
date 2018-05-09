import React from 'react';
import {seasonGet, animeSearch, MALcurrentGet} from './helper/MALget.js';
import {simpleFetch} from './helper/ALget.js';
import Card from './components/card/Card.js';
import Modal from './components/modal/Modal.js';
import Season from './components/season/Season.js';
import Sidebar from './components/sidebar/Sidebar.js';

import { connect } from 'react-redux';
import { getModal } from './redux/actions'

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
    // Modal switches
    changeModal(url){
        this.setState({ isLoading: true })
        this.hideModal()
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
        return animeList.filter((card) => {
            const anime = card.props.anime
            const producers = card.props.producers
            const title = anime.title
            const descrip = anime.synopsis || anime.description

            // Exit 1 - if r18
            if(anime.r18_plus && anime.r18_plus !== this.state.r18){
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
            // Exit 4 - genre
            if(producers && prodFilter && !producers.some(prod => prod.toLowerCase().includes(prodFilter))){
                return false;
            }

            return true


        })
    }

    render() {
        let source, filtered;
        if(this.state.favoritesOnly){
            source = this.props.favorites
        }
        else{
            source = this.state.anime
        }

        if(source){
            const allAnime = source.map((anime) => {
                return <Card key={anime.title} anime={anime} genres={anime.genres}
                    producers={anime.producer ? anime.producer.map((producer) => {return producer.name}) : []}
                    handleModal={(i) => this.showModal(i)}/>
            })

            filtered = this.filter(allAnime)
        }

        const modal = this.state.modal
        ? <Modal data={this.state.modal}
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

        console.log(this.props.modal)
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
                {filtered ? filtered : <Loading/>}
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
      modal: state.modal
  }
}

const mapDispatchToProps = () => {
  return {
    getModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(App)
