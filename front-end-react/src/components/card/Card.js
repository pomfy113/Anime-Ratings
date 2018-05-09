import React from 'react';
import './Card.css'

export default class Card extends React.Component {
    constructor(props){
        super(props);
        this.producers = this.props.producers.join(', ')
        this.title = this.props.anime.title.replace(/&#039;/g, "'")
        this.score = this.props.anime.score ? this.props.anime.score.toFixed(2) : 'N/A'
    }

    render() {
        return(
            <div className="anime-container" style={{backgroundImage: `url(${this.props.anime.image_url})`}}
                onClick={() => this.props.handleModal(this.props.anime.mal_id)}>
                <div className="anime-footer">
                    <div className="anime-title">{this.title}</div>
                    <div className="anime-score">{this.score}
                    </div>
                    <div className="anime-studio">{this.producers}</div>
                </div>
            </div>
        )
    }
}
