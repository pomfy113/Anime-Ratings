import React from 'react';
import {MALfetchCAST, MALfetchEP, seasonGet} from './helper/MALget.js'
import {ALfetch} from './helper/ALget.js'
import moment from 'moment'

export default class Modal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: this.props.data.id || this.props.data.link.split('/')[4],    // Changes depending on source
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

        // If the file exists and a new episode hasn't aired,
        if(loadstate && (loadstate.updateAt > Date.now() || loadstate.updateAt === null)){
            loadstate.tab = 'synopsis';
            this.setState(loadstate);
        }
        // Else, update
        else{
            this.grabALData(this.state.MALdata.title, this.state.link).then(() => {
                localStorage.setItem(this.state.id, JSON.stringify(this.state))
            })
        }
    }

    componentWillUnmount(){
        // Remove closing
        document.removeEventListener("keydown", (ev) => this.props.handleKey(ev));
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
        return ALfetch(title, url).then((data) => {
            this.setState({
                ALdata: data,
                updateAt: (data.nextAiringEpisode ? data.nextAiringEpisode.airingAt * 1000 : null)
            });
        });
    }

    // Heavy; grabs a lot of data from Jikan.
    grabMALData(tab){
        switch(tab){
            // Both include; have this go into one of them
            case 'related':
            // Characters, staff, themes, related
            case 'cast':
                return MALfetchCAST(this.state.MALdata.link || this.state.MALdata.id).then((data) => {
                    this.setState({
                        MALcast: {
                            characters: data.character,
                            staff: data.staff
                        },
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                })
                break;
            // Episodes, themes, related
            case 'episodes':
                return MALfetchEP(this.state.MALdata.link || this.state.MALdata.id).then((data) => {
                    this.setState({
                        MALepisodes: data.episode,
                        MALthemes: [data.opening_theme, data.ending_theme],
                        MALrelated: data.related
                    })
                })
            break;
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

    // Dealing with favorites
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
                break;
            case "cast":
                return <Cast
                    characters={this.state.MALcast.characters}
                    staff={this.state.MALcast.staff}
                    themes={this.state.MALcast.themes}
                />
                break;
            case "episodes":
                return <Episodes
                    episodes={this.state.MALepisodes}
                />
                break;
            case "related":
                return <Related
                    related={this.state.MALrelated}
                    changeModal={(data) => this.props.newModal(data)}
                />
                break;
            default:
                return <div>?</div>
                break;
        }
    }

    render(){
        let currentTab = this.tabGrab(this.state.tab)

        return(
            <div onClick={(i) => this.props.handleClick(i)} className="window-container">
                <div className="window-content">
                    <h1 className="window-title">{this.props.data.title}</h1>
                    <div className="window-favorite" onClick={() => this.changeFavorites()}>
                        {this.state.favIndex !== -1 ? "Remove from favorites" : "Add to favorites"}
                    </div>
                    <ModalBar MALdata={this.props.data} ALdata={this.state.ALdata}/>
                    <Tabs currentTab={this.state.tab} handleTab={(tab, info) => this.tabSwitch(tab, info)}/>
                    <Details currentTab={currentTab}/>
                </div>
            </div>
        )
    }
}

// * * * * * * * * * * * * * * * * * * * *
// SUBCOMPONENT: Bar for the modal
// * * * * * * * * * * * * * * * * * * * *

function ModalBar(props){
    const producers = props.MALdata.studios ?
    props.MALdata.studios.join(', ') :
    props.MALdata.producers.join(', ');

    // The airing time needs al ot of information; function below
    const airingData = AiringData(props.ALdata)

    let airingDisplay;

    switch(airingData){
        case null:
            airingData && props.ALdata
            ? airingDisplay = "Loading!"
            : airingDisplay = "Anilist data not found!"
            break;
        case "N/A":
            airingDisplay = "Currently not airing :c";
            break;
        default:
            airingDisplay =
            <div className="bar-data-airing">
                <div>Ep. {airingData.episode} {airingData.relativeTime}</div>
                <div>{airingData.exactDay}</div>
                <div>{airingData.airingHour}, {airingData.airingDay}s</div>
            </div>
        break;
    }

    return(
        <div className="window-bar">
            <img src={props.MALdata.picture}></img>

            <table className="bar-data">
                <tbody>
                    <tr>
                        <td>Studio:</td><td>{producers}</td>
                    </tr>
                    <tr>
                        <td>Source:</td><td>{props.MALdata.fromType || props.MALdata.source}</td>
                    </tr>
                    <tr>
                        <td>Eps:</td><td>{props.MALdata.nbEp || props.MALdata.episodes}</td>
                    </tr>
                    <tr>
                        <td>Score:</td><td>
                            <div>MAL - {props.MALdata.score} / 10.0</div>
                            <div>Ani - {props.ALdata ? props.ALdata.meanScore : "?"} / 100</div>
                        </td>
                    </tr>
                    <tr>
                        <td>Release:</td><td>{props.MALdata.releaseDate}</td>
                    </tr>
                    <tr>
                        <td>Airing:</td><td>{airingDisplay}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}

// Helper function for subcomponent: modalbar
function AiringData(data){
    if(!data){
        return null;
    }

    const airingData = data.nextAiringEpisode;

    if(!airingData){
        return "N/A"
    }

    const day = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"]
    const episode = airingData.episode;
    const airAt = new Date(airingData.airingAt * 1000)

    const relativeTime = moment(airAt).fromNow();
    const exactDay = moment(airAt).format('MMMM Do, YYYY');
    const airingDay = day[airAt.getDay()] + "day"
    const airingHour = moment(airAt).format('h:mma')

    return {
        episode: episode,
        exactDay: exactDay,
        airingDay: airingDay,
        airingHour: airingHour,
        relativeTime: relativeTime
    }

}

// * * * * * * * * * * * * * * * * * * * *
// SUBCOMPONENT: Details for modal
// * * * * * * * * * * * * * * * * * * * *

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

// Tab-dependent info; see below
function Details(props){
    return(
        <div className="window-details">
            {props.currentTab}
        </div>
    )
}

// Synopsis/summary and trailer
function Synopsis(props){
    return(
        <div className="content content-synopsis">
            <div className="synopsis-text">{props.synopsis}</div>
            <div className="synopsis-trailer">
                {props.trailer ? <Trailer site={props.trailer.site} url={props.trailer.id}/> : null}
            </div>
        </div>
    )
}
    // Trailer for synopsis/summary
    function Trailer(props){
        let url;

        switch(props.site){
            case "dailymotion":
                url = `http://www.${props.site}.com/embed/video/${props.url}`
                break;
            case "youtube":
                url = `http://www.${props.site}.com/embed/${props.url}`
                break;
            case null:
                return null
        }

        return <iframe className="trailer-video" src={url} frameBorder="0" allowFullScreen/>
    }

// Cast; staff and seiyuus
function Cast(props){
    const characters = props.characters.map((char) => {
        // Individual actor
        const actors = char.voice_actor.map((actor, index) => {
            // API pls.
            return(
                <div key={`${actor.name.replace("&#039;", "'")}-${index}`} className="actor">
                    <div className="actor-name name"><a href={actor.url}>{actor.name}</a></div>
                    <div className="actor-language secondary">{actor.language}</div>
                    <img className="actor-image" src={actor.image_url}/>
                </div>
            )
        })

        // Individual rows per actor
        return(
            <div key={`${char.name}`} className="content content-character">
                <div className="character">
                    <div className="character-name name"><a href={char.url}>{char.name}</a></div>
                    <div className="character-role secondary">{char.role}</div>
                    <img className="character-image" src={char.image_url}/>
                </div>
                <div className="actors">{actors}</div>
            </div>
        )
    })

    return(
        <div className="content content-cast">
            {characters}
        </div>
    )
}

// Related anime; adaptations, sequels, spinoffs, etc.
function Related(props){
    let relationships = [];

    for(let type in props.related){
        // First let's actually seperate them by type
        const reltype = props.related[type].map((anime, index) => {
            return(
                <a
                    key={`${type}-${index}`}
                    href={anime.type === 'manga' ? anime.url : null}                                // If paper medium, redirect
                    onClick={anime.type === 'anime' ? () => props.changeModal(anime.url) : null}    // If anime, open new modal
                    className="related-cont">
                    <div className={`related-anime ${anime.type}`}>
                        <div className="related-anime-title">
                            {anime.title.replace("&#039;", "\'")}
                        </div>
                        <div className="related-anime-type">
                            {anime.type === 'anime' ? anime.type.toUpperCase() : 'MANGA/NOVEL (external link)'}
                        </div>
                    </div>
                </a>
            )
        });
        // Now let's actually put it into the list of relationships
        relationships.push(
            (<div key={type} className="related-category">
                <h1 className="related-category-title">{type}</h1>
                {reltype}
            </div>)
        )
    }

    return(
        <div className="content content-related">
            {relationships}
        </div>
    )
}

// Episodes; has link to video, discussion forum, episode list, etc.
function Episodes(props){
    if(!props.episodes || !props.episodes.length){
        return (<p>No episode data available </p>)
    }

    const episodes = props.episodes.map((ep) => {
        return(
            <tr key={ep.id} className="ep-row">
                <td className="eptable-id">{ep.id}</td>
                <td className="eptable-title">
                    <p className="eptitle-eng">
                        <a href={ep.video_url}>
                            {ep.title.replace("&#039;", "'")}
                        </a>
                    </p>
                    <p className="eptitle-jpn">{ep.title_japanese}</p>
                </td>
                <td className="eptable-air">{ep.aired}</td>
                <td className="eptable-filler">
                    {ep.filler ? 'Filler' : null}
                    {ep.filler && ep.recap ? '/' : null}
                    {ep.recap ? 'Recap' : null}</td>
                    <td className="eptable-forum"><a href={ep.forum_url}>Link</a></td>
                </tr>
            )
        })

        return(
            <div>
                <table className="content content-episodes">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Air Date</th>
                            <th></th>
                            <th>Forum</th>
                        </tr>
                        {episodes}
                    </tbody>
                </table>
            </div>
        )
    }
