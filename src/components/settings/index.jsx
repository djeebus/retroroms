import React, { Component } from 'react';
import { connect } from 'react-redux';
import {scanForRoms, pathAdded} from '../../actions';
import electron from 'electron';


const Settings = ({paths, onGetPath, onRescan}) => {
    let renderPath = (path) => {
        if (typeof path != 'string') {
            console.warn('wtf is: ', path);
            return;
        }

        return (
            <li key={path}>
                ${path} (<a href="#" onClick={onRescan}>Rescan</a>)
            </li>
        );
    };

    return (
        <div>
            <ul>
                {paths.map(renderPath)}
            </ul>

            <button onClick={onGetPath}>Open Path</button>
        </div>
    );
};


const mapStateToProps = ({paths}) => {
    return {paths: paths};
};


const mapDispatchToProps = (dispatch) => {
    return {
        onRescan: (path) => {
            console.log('path: ', path);
            dispatch(scanForRoms(path));
        },
        onGetPath: () => {
            let dialog = electron.remote.dialog,
                app = electron.remote.app,
                dialogOptions = {
                    title: 'Open ROMS path',
                    defaultPath: app.getPath('home'),
                    properties: ['openDirectory'],
                };

            dialog.showOpenDialog(dialogOptions, function (paths) {
                paths.forEach(path => {
                    dispatch(pathAdded(path));
                    dispatch(scanForRoms(path))
                });
            })
        }
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);
