import wrapPromise from 'wrap-promise';
import recursive from './lib/recursive-readdir';


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
