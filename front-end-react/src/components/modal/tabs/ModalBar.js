import React from 'react';
import moment from 'moment'


export default function ModalBar(props){
    const studios = props.MALdata.studio
    ? props.MALdata.studio.map((studio) => { return studio.name }).join(', ')
    : null

    // The airing time needs al ot of information; function below
    const airingData = AiringData(props.ALdata)

    let airingDisplay;
    switch(airingData){
        case null:
            airingData && props.ALdata
            ? airingDisplay = "Anilist data not found!"
            : airingDisplay = "Loading!"
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

    const release = props.MALdata.aired_string;

    return(
        <div className="window-bar">
            <img src={props.MALdata.image_url} alt="Anime cover"></img>
            {props.favorite}
            <table className="bar-data">
                <tbody>
                    <tr>
                        <td>Studio:</td><td>{studios}</td>
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
                        <td>Air Dates:</td><td>{release}</td>
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
