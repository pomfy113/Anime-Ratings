import React from 'react';

export default function Cast(props){
    if(!props.characters){
        return (<p className="empty">No MAL character data available</p>)
    }

    const characters = props.characters.map((char) => {
        // Individual actor
        const actors = char.voice_actor.map((actor, index) => {
            // API pls.
            return(
                <div key={`${actor.name.replace("&#039;", "'")}-${index}`} className="actor">
                    <div className="actor-name name"><a href={actor.url}>{actor.name}</a></div>
                    <div className="actor-language secondary">{actor.language}</div>
                    <img className="actor-image" alt="Actor" src={actor.image_url}/>
                </div>
            )
        })

        // Individual rows per actor
        return(
            <div key={`${char.name}`} className="content content-character">
                <div className="character">
                    <div className="character-name name"><a href={char.url}>{char.name}</a></div>
                    <div className="character-role secondary">{char.role}</div>
                    <img className="character-image" alt="Character" src={char.image_url}/>
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
