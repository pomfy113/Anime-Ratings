import React from 'react';

export default function Related(props){
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
                            {anime.title.replace("&#039;", "'")}
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
