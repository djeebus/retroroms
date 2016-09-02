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


const scannerInitialState = {isScanning: false};
function scannerReducer(state = scannerInitialState, action) {
    switch (action.type) {
        case actions.BEGIN_ROMS_SCAN:
            return {
                ...state,
                isScanning: true,
            };

        case actions.END_ROMS_SCAN:
            return {
                ...state,
                isScanning: false,
            };

        default:
            return state;
    }
}

const pathsInitialState = [];
function pathsReducer(state = pathsInitialState, action) {
    switch (action.type) {
        case actions.PATH_ADDED:
            return [
                ...state,
                action.path,
            ];

        default:
            return state;
    }
}


function romReducer(rom, action) {
    switch (action.type) {
        case actions.ROM_FOUND:
            if (action.path !== rom.path) {
                return rom;
            }


    }
}


const romsInitialState = [];
function romsReducer(state = romsInitialState, action) {
    if (state === undefined) {
        state = romsInitialState;
    }

    switch (action.type) {
        case actions.ROM_FOUND:
            let existing = state.findIndex(r => r.path == action.path);
            if (existing >= 0) {
                return state;
            }

            return [
                ...state,
                {path: action.path},
            ];

        default:
            return state.map(rom => romReducer(rom, action));
    }
}


export default combineReducers({
    consoles: consolesReducer,
    scanner: scannerReducer,
    paths: pathsReducer,
    roms: romsReducer,
});
