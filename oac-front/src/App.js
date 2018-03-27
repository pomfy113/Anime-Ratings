import React from 'react';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            anime: null,
            favoritesOnly: false
        }
    }

    componentDidMount(){
        fetch('/get-current', {method: 'GET'}).then((data) => {
            return data.json()
        }).then((data) => {
            this.setState({anime: data})
        })

    }

    filterHandler(allAnime){
        // Post category filtering; uses state
        const filterTypes = ['title', 'synopsis', 'studio']
        const currentFilter = this.state.filter

        const filtered = allAnime.filter((card) => {
            // Faster access
            const anime = card.props.anime
            let check = true;

            for(let index in filterTypes){
                const filter = filterTypes[index]
                // If null, we don't have to worry
                if(currentFilter[filter]){
                    const data = currentFilter[filter].toLowerCase()
                    // Simple if searching synopsis or title
                    if(filter !== 'studio' && !anime[filter].toLowerCase().includes(data)){
                        check = false;
                        break;
                    }
                    // If it's a studio, we need to check the whole array
                    else if(filter === 'studio' && !anime.producers.some(studio => studio.toLowerCase().includes(data))){
                        check = false;
                        break;
                    }
                }
            }

            // Early exit 1
            if(check === false){ return false }

            if(this.state.genres.length > 0){
                return card.props.genres.some(genre => this.state.genres.includes(genre))
            }
            else{
                return true
            }

        })
    }

    render() {
        let source;
        if(this.state.favoritesOnly){
            source = this.state.favorites
        }
        else{
            source = this.state.anime
        }

        if(source){
            const allAnime = source.map((anime) =>{
                return <Card
                    key={anime.title}
                    anime={anime}
                    genres={anime.genres}
                    handleModal={(i) => this.showModal(i)}
                />
            })

            this.filterHandleer(allAnime)
        }

        return (
            <div className="App">
                {stuff}
            </div>
        );
    }
}

export default App;
