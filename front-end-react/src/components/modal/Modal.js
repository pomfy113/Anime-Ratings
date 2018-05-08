import React from 'react';
import {MALfetchCAST, MALfetchEP} from '../../helper/MALget.js'
import {ALfetch} from '../../helper/ALget.js'
import './Modal.css'
import './Modal-mobile.css'

import Synopsis from './tabs/Synopsis.js';
import Cast from './tabs/Cast.js';
import Related from './tabs/Related.js';
import Episodes from './tabs/Episodes.js';
import ModalBar from './tabs/ModalBar.js';

export default class Modal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: this.props.data.mal_id,    // Changes depending on source
            tab: 'synopsis',
            MALdata: this.props.data,       // Available from start
            favIndex: -1,                   // Where it is in the favorites
            ALdata: null,                   // SHOULD be available on start; airing, score, trailer
            updateAt: null,
            // MAL info
            MALcast: null,                  // Includes staff
            MALepisodes: null,              // Includes episodes, forum
            MALthemes: null,                // On both episode/cast fetches; OP, ED
            MALrelated: null                // On both episode/cast fetches; related
        }
    }

    componentDidMount(){
        // For closing
        document.addEventListener("keydown", (ev) => this.props.handleKey(ev));
        // Find index in favorites
        this.findIndex()
        // Loading
        let loadstate = JSON.parse(localStorage.getItem(this.state.id));

        // If the file exists and a new episode hasn't aired, and ALdata is there
        if(loadstate && (loadstate.updateAt > Date.now() || loadstate.updateAt === null) && loadstate.ALdata){
            loadstate.tab = 'synopsis';
            this.setState(loadstate);
        }
        // Else, update
        else{
            this.setData(this.state.MALdata.title, this.state.MALdata.mal_id);
        }
    }

    componentWillUnmount(){
        // Remove closing
        document.removeEventListener("keydown", (ev) => this.props.handleKey(ev));
    }

    setData(title, url){
        this.grabALData(title, url).then(() => {
            localStorage.setItem(this.state.id, JSON.stringify(this.state))
        })
    }

    // Should hit this immediately; check all of favorites to see if current data is in there
    findIndex(){
        this.props.favorites.forEach((item, index) => {
            if(this.state.MALdata.title === item.title){
                this.setState({favIndex: index})
            }
        })
    }

    // Should hit this immediately; lightweight gathering of data
    grabALData(title, url){
        this.props.toggleLoading()

        return ALfetch(title, url).then((data) => {
            let ALdata, MALepisodes;
            if(Array.isArray(data) && data.length === 2){
                ALdata = data[0]
                MALepisodes = data[1]
            }
            else{
                ALdata = data
            }
            this.setState({
                ALdata: ALdata,
                updateAt: (ALdata && ALdata.nextAiringEpisode ? ALdata.nextAiringEpisode.airingAt * 1000 : null),
                MALepisodes: MALepisodes && !this.state.MALepisodes ? MALepisodes : this.state.MALepisodes
            });
            this.props.toggleLoading()

        });
    }

    // Heavy; grabs a lot of data from Jikan.
    grabMALData(tab){
        this.props.toggleLoading()
        switch(tab){
            // Both include; have this go into one of them
            // Characters, staff, themes, related
            case 'related':
            case 'cast':
                return MALfetchCAST(this.state.MALdata.mal_id).then((data) => {
                    this.setState({
                        MALcast: {
                            characters: data.character,
                            staff: data.staff
                        },
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                    this.props.toggleLoading()
                })
            // Episodes, themes, related
            case 'episodes':
                return MALfetchEP(this.state.MALdata.mal_id).then((data) => {
                    this.setState({
                        MALepisodes: data.episode,
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                    this.props.toggleLoading()

                })
            default:
                alert("Something happened during fetching!")
                return null;
        }

    }

    // Switching between info tabs
    tabSwitch(tab, info){
        if(this.state[`MAL${tab}`] === null){
            this.grabMALData(tab).then(() => {
                localStorage.setItem(this.state.id, JSON.stringify(this.state))
                this.setState({tab: tab})
            })
        }
        else{
            this.setState({tab: tab})
        }
    }

    // Changing whether this is in favorites or not
    changeFavorites(){
        let favoritesCopy = this.props.favorites;
        let modalInfo = this.state.MALdata;

        // If it's in there, remove
        if(this.state.favIndex !== -1){
            favoritesCopy.splice(this.state.favIndex, 1);
            this.setState({favIndex: -1})
        }
        // Else, push in a new copy
        else{
            favoritesCopy.push(modalInfo)
            this.setState({favIndex: favoritesCopy.length - 1})
        }

        return this.props.handleFavorites(favoritesCopy)
    }

    // Grabbing the proper tab
    tabGrab(tab){
        switch(tab){
            case "synopsis":
                return <Synopsis
                    synopsis={this.state.MALdata.synopsis}
                    trailer={this.state.ALdata ? this.state.ALdata.trailer : null}
                />
            case "cast":
                return <Cast
                    characters={this.state.MALcast.characters}
                    staff={this.state.MALcast.staff}
                    themes={this.state.MALcast.themes}
                />
            case "episodes":
                return <Episodes
                    episodes={this.state.MALepisodes}
                />
            case "related":
                return <Related
                    related={this.state.MALrelated}
                    changeModal={(data) => this.props.newModal(data)}
                />
            default:
                return <div>?</div>
        }
    }

    render(){
        let currentTab = this.tabGrab(this.state.tab)
        const favorite = <div className={`window-favorite ${this.state.favIndex !== -1 ? 'on' : null}`}
                        onClick={() => this.changeFavorites()}>
                            {this.state.favIndex !== -1 ? '★' :'☆'}
                         </div>
        return(
            <div onClick={(i) => this.props.handleClick(i)} className="window-container">
                <div className="window-content">
                    <h1 className="window-title">{this.props.data.title}</h1>
                    <ModalBar MALdata={this.props.data} ALdata={this.state.ALdata} favorite={favorite}/>
                    <Tabs currentTab={this.state.tab} handleTab={(tab, info) => this.tabSwitch(tab, info)}/>
                    <Details currentTab={currentTab}/>
                </div>
            </div>
        )
    }
}

// Navigation tabs
function Tabs(props){
    const allTabs = ['synopsis', 'cast', 'episodes', 'related'];
    const tabNames = ['Story', 'Cast', 'Eps.', 'Related'];

    const tabs = allTabs.map((tab, index) => {
        const load = (tab === 'synopsis' ? null : 'MAL');           // Whether to load MAL or not
        const onTab = props.currentTab === tab                      // See if it's on
        const className = `tab-${tab} ` + (onTab ? 'on' : null);    // If on, add "on"

        return(<div key={tab} className={className} onClick={() => props.handleTab(tab, load)}> {tabNames[index]}</div>)
    });

    return(
        <div className="window-tabs">
            {tabs}
        </div>
    )
}

// Tab-dependent info
function Details(props){
    return(
        <div className="window-details">
            {props.currentTab}
        </div>
    )
}
