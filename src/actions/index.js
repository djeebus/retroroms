import {scanForRoms as apiRomsScan} from '../api/fs';

export const BEGIN_ROMS_SCAN = 'BEGIN_ROMS_SCAN';
export const END_ROMS_SCAN = 'END_ROMS_SCAN';
export function scanForRoms(path) {
    console.log('scan for roms!');
    return function (dispatch) {
        console.log('scanning for roms ... ');
        dispatch({type: BEGIN_ROMS_SCAN, path: path});

        apiRomsScan(path, function (game) {
            dispatch(romFound(game))
        });
    };
}


export const PATH_ADDED = 'PATH_ADDED';
export function pathAdded(path) {
    return {
        type: PATH_ADDED,
        path: path,
    };
}


export const ROM_FOUND = 'ROM_FOUND';
function romFound(game) {
    return {
        type: ROM_FOUND,
        game: game,
    };
}
