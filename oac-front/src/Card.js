import React from 'react';

export default class Card extends React.Component {
    constructor(props){
        super(props)
        this.producers = this.props.anime.producers.join(', ')
    }

    render() {
        return(
            <div className="anime-container"
                style={{backgroundImage: `url(${this.props.anime.picture})`}}
                onClick={() => this.props.handleModal(this.props.anime)}
                >
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
