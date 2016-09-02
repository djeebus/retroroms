import {combineReducers} from 'redux';
import * as actions from '../actions';


/* --- state ---

{
    paths: [
        {
            path: /roms/,
        },
    ],
    roms: [
        {
            console: 'snes',
            path: '/roms/snes/tetris.smc',
        },
    ],
    consoles: [
        {
            console: 'snes',
            executable: '',
        }
    ]
}


 */




const consolesInitialState = {};
function consolesReducer(state = consolesInitialState, action) {
    switch (action.type) {
        case actions.ADD_CONSOLE:
            return state;

        case actions.REMOVE_CONSOLE:
            return state;

        default:
            return state;
    }
}

const romsInitialState = {};
function romsReducer(state = romsInitialState, action) {
    switch (action.type) {
        case actions.BEGIN_ROMS_SCAN:
            return {
                ...state,
                isFetching: true,
            };

        case actions.ROM_FOUND:
            let state = {...state};

            return {
                ...state,
            };

        case actions.END_ROMS_SCAN:
            return {
                ...state,
                isFetching: false,
            };
    }

    return state;
}

const pathsInitialState = [];
function pathsReducer(state = pathsInitialState, action) {
    switch (action.type) {
        case actions.BEGIN_ROMS_SCAN:
            return [
                ...state,
                action.path,
            ];


        default:
            return state;
    }
}


export default combineReducers({
    consoles: consolesReducer,
    roms: romsReducer,
    paths: pathsReducer,
});
