import React from 'react';
import './Card.css'

export default class Card extends React.Component {
    constructor(props){
        super(props);
        this.producers = this.props.producers.join(', ')
    }

    render() {
        return(
            <div className="anime-container" style={{backgroundImage: `url(${this.props.anime.image_url})`}}
                onClick={() => this.props.handleModal(this.props.anime.mal_id)}>
                <div className="anime-footer">
                    <div className="anime-title">{this.props.anime.title}</div>
                    <div className="anime-score">{this.props.anime.score}
                    </div>
                    <div className="anime-studio">{this.producers}</div>
                </div>
            </div>
        )
    }
}
