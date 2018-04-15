import React from 'react';


export default class Toolbar extends React.Component {
    render(){
        return(
            <div>
                <input type='textbox'/><button>Search for Anime</button>
                <button onClick={this.props.favoritesOnly}>Test!</button>
            </div>
        )
    }
}
