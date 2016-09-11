import path from 'path';
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
export const ROM_UPDATED = 'ROM_UDPATED';
export function identifyRom(rom) {
    return function (dispatch) {
        dispatch({
            type: IDENTIFYING_ROM,
            rom: rom,
        });

        let ext = path.extname(rom.path);
        console.log('extension: ', ext);
        if (ext == '.smc') {
            dispatch({
                type: ROM_UPDATED,
                rom: rom,
                console: 'snes',
            });
        }
    };
}
