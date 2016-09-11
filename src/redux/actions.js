import * as api from '../api';

export const BEGIN_ROMS_SCAN = 'BEGIN_ROMS_SCAN';
export const END_ROMS_SCAN = 'END_ROMS_SCAN';
export function scanForRoms(path) {
    return function (dispatch) {
        console.log('scanning for roms ... ');
        dispatch({type: BEGIN_ROMS_SCAN, path: path});

        api.scanForRoms(path, function (romPath) {
            dispatch(addRom(romPath))
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
export function addRom(path) {
    return {
        type: ROM_FOUND,
        path: path,
    };
}


export const ROM_REMOVED = 'ROM_REMOVED';
export function removeRom(rom) {
    return {
        type: ROM_REMOVED,
        path: rom.path,
    };
}


export const IDENTIFYING_ROM = 'IDENTIFYING_ROM';
export const ROM_IDENTIFIED = 'ROM_IDENTIFIED';
export const ROM_UNIDENTIFIED = 'ROM_UNIDENTIFIED';
export function identifyRom(rom) {
    return function (dispatch) {
        dispatch({
            type: IDENTIFYING_ROM,
            rom: rom,
        });

        api.getGameMetadata(rom.path)
            .then(result => {
                dispatch({
                    type: ROM_IDENTIFIED,
                    rom: rom,
                    result: result,
                })
            })
            .catch(err => {
                dispatch({
                    type: ROM_UNIDENTIFIED,
                    rom: rom,
                })
            });
    };
}
