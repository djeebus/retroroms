import React from 'react';
import Settings from '../settings';


function Game({game}) {
    return <div key={game.fname}>{game.name}</div>
}


export default ({games}) => {
    return (
        <div>
            <p>This app is loaded</p>
            {/*${consoles.map(c => Console(c))}*/}
            <Settings />
        </div>
    );
};
