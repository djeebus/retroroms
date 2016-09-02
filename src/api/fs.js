import fs from 'fs';
import path from 'path';


export function scanForRoms(dirPath, callback) {
    fs.readdir(dirPath, function (err, files) {
        if (err) {
            throw err;
        }

        files.map(function (file) {
            return path.join(dirPath, file);
        }).forEach(function (file) {
            fs.stat(file, (err, info) => {
                if (err) {
                    throw err;
                }

                if (info.isFile()) {
                    identifyFile(file, (err, game) => {
                        if (err) {
                            throw err;
                        }

                        callback(game);
                    });
                } else if (info.isDirectory()) {
                    scanForRoms(file, callback);
                } else {
                    console.warn('wtf is this? ', file);
                }
            });
        });
    });
}


function identifyFile(fname, callback) {
    let extension = path.extname(fname);
    if (extension == '.smc') {
        callback(null, new SnesGame(fname));
    } else if (extension == '.zip') {
        identifyZipFile(fname, callback);
    }
}


function identifyZipFile(fname, callback) {

}


class SnesGame {
    constructor(fname) {
        this.console = 'snes';
        this.fname = fname;
    }
}
