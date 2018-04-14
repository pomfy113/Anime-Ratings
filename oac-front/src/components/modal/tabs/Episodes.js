import React from 'react';

export default function Episodes(props){
    if(!props.episodes || !props.episodes.length){
        return (<p className="empty">No MAL episode data available</p>)
    }

    const episodes = props.episodes.map((ep) => {
        return(
            <tr key={ep.id} className="ep-row">
                <td className="eptable-id">{ep.id}</td>
                <td className="eptable-title">
                    <p className="eptitle-eng">
                        <a href={ep.video_url}>
                            {ep.title.replace("&#039;", "'")}
                        </a>
                    </p>
                    <p className="eptitle-jpn">{ep.title_japanese}</p>
                </td>
                <td className="eptable-air">{ep.aired}</td>
                <td className="eptable-filler">
                    {ep.filler ? 'Filler' : null}
                    {ep.filler && ep.recap ? '/' : null}
                    {ep.recap ? 'Recap' : null}</td>
                    <td className="eptable-forum"><a href={ep.forum_url}>Link</a></td>
                </tr>
            )
        })

        return(
            <div>
                <table className="content content-episodes">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Air Date</th>
                            <th></th>
                            <th>Forum</th>
                        </tr>
                        {episodes}
                    </tbody>
                </table>
            </div>
        )
    }
