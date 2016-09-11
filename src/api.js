import path from 'path';
import recursive from './lib/recursive-readdir';
import {parseString} from 'xml2js';
import wrapPromise from 'wrap-promise';
require('es6-promise').polyfill();
require('isomorphic-fetch');



function readDir(path) {
    return wrapPromise((resolve, reject) => {
        recursive(path, function (err, paths) {
            if (err) {
                reject(err);
                return;
            }

            resolve(paths);
        });
    })
}


export function scanForRoms(dirPath, callback) {
    return readDir(dirPath)
        .then(paths => paths.forEach(p => callback(p)));
}


class TGDBError {
    constructor(response) {
        this.response = response;
    }
}

function theGamesDbApiCall(path, params) {
    return wrapPromise((resolve, reject) => {
        let parts = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
        let query = parts.join('&');

        return fetch(`http://thegamesdb.net/api${path}?${query}`)
            .then(response => {
                if (response.status >= 400) {
                    reject(new TGDBError(response));
                    return;
                }

                return response.text();
            })
            .then(text => {
                parseString(text, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
    });
}


export function getGameMetadata(fname) {
    return wrapPromise((resolve, reject) => {
        let platform = identifyPlatform(fname);
        if (!platform) {
            return;
        }

        let name = getNameFromFname(fname);

        theGamesDbApiCall(
            '/GetGame.php',
            {name, platform},
        ).then(result => {
            let matches = result.Data.Game.filter(
                game => game.GameTitle[0] == name);

            if (!matches) {
                reject('no results found');
                return;
            }

            let imageBase = 'http://thegamesdb.net/banners/';

            let match = matches[0];
            resolve({
                name: match.GameTitle[0],
                description: match.Overview[0],

                theGameDbId: parseInt(match.id[0]),
                coop: match['Co-op'] == 'Yes',
                developer: match.Developer[0],
                publisher: match.Publisher[0],
                players: parseInt(match.Players[0]),
                genres: match.Genres.map(g => g.genre[0]),
                clearlogo: !match.Images[0].clearlogo ? [] :
                    match.Images[0].clearlogo.map(i => {
                        return {
                            width: parseInt(i['$'].width),
                            height: parseInt(i['$'].height),
                            url: `${imageBase}${i['_']}`,
                        };
                    }),
                boxart: !match.Images[0].boxart ? [] :
                    match.Images[0].boxart.map(i => {
                        return {
                            height: parseInt(i['$'].height),
                            side: i['$'].side,
                            url: `${imageBase}${i['_']}`,
                            thumbUrl: `${imageBase}${i['$'].thumb}` ,
                            width: parseInt(i['$'].width),
                        };
                    }),
                screenshots: !match.Images[0].screenshot ? [] :
                    match.Images[0].screenshot.map(i => {
                        return {
                            height: parseInt(i.original[0]['$'].height),
                            width: parseInt(i.original[0]['$'].width),
                            url: `${imageBase}${i.original[0]['_']}`,
                            thumbUrl: `${imageBase}${i.thumb[0]}`,
                        };
                    }),
            })
        });
    });
}


const extensions = {
    '.smc': 'Super Nintendo (SNES)',
};

function identifyPlatform(fname) {
    let ext = path.extname(fname);
    let platform = extensions[ext];
    return platform;
}


function getNameFromFname(fname) {
    let ext = path.extname(fname);
    let name = path.basename(fname, ext);
    name = name.replace(/\((V\d+\.\d+|U)\)|\[\!\]/g, '');
    return name.trim();
}
