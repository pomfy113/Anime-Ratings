import React from 'react';
import { getModal, hideModal, loadingOn } from '../../../redux/actions'
import { connect } from 'react-redux'

function Related(props){
    let relationships = [];
    for(let type in props.related){
        // First let's actually seperate them by type
        const reltype = props.related[type].map((anime, index) => {
            return(
                <a
                    key={`${type}-${index}`}
                    href={anime.type === 'manga' ? anime.url : null}                                // If paper medium, redirect
                    target="_blank"
                    onClick={anime.type === 'anime' ? () => {
                      props.hideModal();
                      props.loadingOn();
                      props.getModal(anime.mal_id);
                    } : null}    // If anime, open new modal
                    className="related-cont">
                    <div className={`related-anime ${anime.type}`}>
                        <div dangerouslySetInnerHTML={{__html: anime.title}} className="related-anime-title"/>
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

const mapStateToProps = (state) => {
  return { modal: state.modal }
}

const mapDispatchToProps = () => {
  return {
    getModal, hideModal, loadingOn
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(Related)
