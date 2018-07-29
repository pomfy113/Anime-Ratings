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

import { toggleFavorite, hideModal, loadingOn, loadingOff } from '../../redux/actions'
import { connect } from 'react-redux'

class Modal extends React.Component {
    constructor(props){
        super(props)
        console.log(this.props.modal)
        this.state = {
            id: this.props.modal.MALdata.mal_id, // Changes depending on source
            tab: 'synopsis',
            MALdata: this.props.modal.MALdata,  // Available from start
            ALdata: this.props.modal.ALdata,    // SHOULD be available on start; airing, score, trailer
            updateAt: null,
            // MAL info
            MALcast: null,                      // Includes staff
            MALepisodes: null,                  // Includes episodes, forum
            MALthemes: null,                    // On both episode/cast fetches; OP, ED
            MALrelated: this.props.modal.MALdata.related // On both episode/cast fetches; related
        }
    }

    escapeCheck(ev){
        if(ev.key === 'Escape' || ev.target.className === 'window-container'){
            this.props.hideModal(document)
        }
    }

    componentDidMount(){
        // For closing
        document.addEventListener("keydown", (ev) => this.escapeCheck(ev));
        // Loading
        let loadstate = JSON.parse(localStorage.getItem(this.state.id));

        // If the file exists and a new episode hasn't aired, and ALdata is there
        if(loadstate && (loadstate.updateAt > Date.now() || loadstate.updateAt === null) && loadstate.ALdata){
            loadstate.tab = 'synopsis';
            this.setState(loadstate);
        }
        // Else, update
        else{
            this.setData(this.props.modal.MALdata.title, this.props.modal.MALdata.mal_id);
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

    // Should hit this immediately; lightweight gathering of data
    grabALData(title, url){
        this.props.loadingOn()
        return ALfetch(this.props.modal.MALdata.title_japanese).then((ALdata) => {
            this.setState({
                ALdata: ALdata,
                updateAt: (ALdata && ALdata.nextAiringEpisode ? ALdata.nextAiringEpisode.airingAt * 1000 : null),
            });
            this.props.loadingOff()

        });
    }

    // Heavy; grabs a lot of data from Jikan.
    grabMALData(tab){
        this.props.loadingOn()
        switch(tab){
            // Both include; have this go into one of them
            // Characters, staff, themes, related
            case 'related':
            case 'cast':
                return MALfetchCAST(this.props.modal.MALdata.mal_id).then((data) => {
                    this.setState({
                        MALcast: {
                            characters: data.character,
                            staff: data.staff
                        },
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                    this.props.loadingOff()
                })
            // Episodes, themes, related
            case 'episodes':
                return MALfetchEP(this.props.modal.MALdata.mal_id).then((data) => {
                    this.setState({
                        MALepisodes: data.episode,
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                    this.props.loadingOff()

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

    // Grabbing the proper tab
    tabGrab(tab){
        switch(tab){
            case "synopsis":
                return <Synopsis
                    synopsis={this.props.modal.MALdata.synopsis}
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
                return <Related related={this.props.modal.MALdata.related}/>
            default:
                return <div>?</div>
        }
    }

    render(){
        const isOn = this.props.favorites.indexOf(this.state.MALdata) !== -1
        let currentTab = this.tabGrab(this.state.tab)
        const favorite = <div className={`window-favorite ${isOn ? 'on' : null}`}
                            onClick={() => this.props.toggleFavorite(this.state.MALdata)}>
                            {isOn ? '★' :'☆'}
                         </div>
        return(
            <div onClick={(ev) => this.escapeCheck(ev)} className="window-container">
                <div className="window-content">
                    <h1 className="window-title">{this.state.MALdata.title}</h1>
                    <ModalBar MALdata={this.state.MALdata} ALdata={this.state.ALdata} favorite={favorite}/>
                    <Tabs currentTab={this.state.tab} handleTab={(tab, info) => this.tabSwitch(tab, info)}/>
                    <div className="window-details">
                        {currentTab}
                    </div>
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

const mapStateToProps = (state) => {
  return {
      favorites: state.favorites,
      modal: state.modal
   }
}

const mapDispatchToProps = () => {
  return {
    toggleFavorite, hideModal, loadingOn, loadingOff
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(Modal)
