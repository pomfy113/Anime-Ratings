import React from 'react';

export default class Card extends React.Component {
    constructor(props){
        super(props);
        this.props.anime.producers
            ? this.producers = this.props.anime.producers.join(', ')
            : this.producers = null;
    }

    render() {
        return(
            <div className="anime-container" style={{backgroundImage: `url(${this.props.anime.picture || this.props.anime.image_url})`}}
                onClick={() => this.props.handleModal(this.props.anime.url || this.props.anime.link)}>
                <div className="anime-footer">
                    <div className="anime-title">{this.props.anime.title}</div>
                    <div className="anime-score">
                        {this.props.anime.score === '0' ? 'N/A' : this.props.anime.score}
                    </div>
                    <div className="anime-studio">{this.producers}</div>
                </div>
            </div>
        )
    }
}
