import React from 'react';
import moment from 'moment'


export default function ModalBar(props){
    console.log("STUDIOS?", props.MALdata)
    const producers = props.MALdata.studios
        ? props.MALdata.studios.join(', ')
        : props.MALdata.producers.join(', ');

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

    let release;
    if(props.MALdata.releaseDate){
        const fullDate = props.MALdata.releaseDate
        release = fullDate.substring(0, fullDate.lastIndexOf(','))
    }
    else if(props.MALdata.aired){
        const fullDate = props.MALdata.aired
        release = fullDate.substring(0, fullDate.lastIndexOf(' to'))
    }
    else{
        release = "Info not found!"
    }

    return(
        <div className="window-bar">
            <img src={props.MALdata.picture} alt="Anime cover"></img>
            {props.favorite}
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
                        <td>Release:</td><td>{release}</td>
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
