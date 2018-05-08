import React from 'react';

export default function Synopsis(props){
    console.log(props)
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
        default:
            alert("Something wrong happened!")
            return null
    }

    return <iframe title="Trailer" className="trailer-video" src={url} frameBorder="0" allowFullScreen/>
}
