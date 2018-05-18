import React from 'react';
import './Season.css'

import { loadingOn, loadingOff } from '../../redux/actions'
import { connect } from 'react-redux'

class Season extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentSeason: this.props.season
        };
        this.seasons = ["winter", "spring", "summer", "fall"];
        this.selection = [-2, -1, 0, 1, 2]

    }

    changeSeason(season, year){
        if(this.props.loading){
            return null
        }
        this.setState({
            currentSeason: {
                season: season,
                year: year
            }
        })
        
        this.props.handleSeason(this.seasons[season], year)
    }

    render(props){
        const seasons = this.selection.map((season) => {
            // Anime is weird when it comes to dates
            // Winter season starts off the year, so we need to tweak this a bit
            const year = this.state.currentSeason.year + Math.floor((this.state.currentSeason.season + season) / 4);
            const seasonIndex = ((this.state.currentSeason.season + season) % 4 + 4) % 4;
            // 2018 + (4+1) or 5 / 4 is 1

            return(
                <div key={season}
                    onClick={() => this.changeSeason(seasonIndex, year)}
                    className='season-select'>
                    {capitalizeSeason(this.seasons[seasonIndex])}, {year}
                </div>
            )

        })
        return(
            <div className={`season-cont ${this.props.loading ? 'disabled' : null}`}>
                {seasons}
            </div>
        )
    }
    }


function capitalizeSeason(season){
    return season[0].toUpperCase() + season.substring(1)
}

const mapStateToProps = (state) => {
  return {
      loading: state.loading
  }
}

const mapDispatchToProps = () => {
  return { loadingOn, loadingOff }
}

export default connect(mapStateToProps, mapDispatchToProps())(Season)
