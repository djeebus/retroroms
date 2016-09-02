import React, { Component } from 'react';
import { connect } from 'react-redux';
import {scanForRoms, pathAdded} from '../../actions';
import electron from 'electron';


class Path extends Component {
    render() {
        let path = this.props.path;

        return (
            <li key={path}>
                ${path}
                <button onClick={() => this.props.onRescan(path)}>
                    Rescan
                </button>
            </li>
        );
    }
}


class Rom extends Component {
    render() {
        let rom = this.props.rom;

        return (
            <li key={rom.path}>
                ${rom.name}
                <button onClick={() => this.props.onRemoveRom(rom)}>
                    Remove
                </button>
            </li>
        );
    }
}


const Settings = ({paths, roms, onGetPath, onRescan, onRemoveRom}) => {
    return (
        <div>
            <h1>Paths</h1>
            <ul>
                {paths.map(path => <Path key={path} path={path}
                                         onRescan={onRescan} />)}
            </ul>

            <button onClick={onGetPath}>Open Path</button>

            <h1>ROMs</h1>
            <ul>
                {roms.map(rom => <Rom key={rom.path} rom={rom} onRemoveRom={onRemoveRom} />)}
            </ul>
        </div>
    );
};


const mapStateToProps = ({paths, roms}) => {
    return {paths, roms};
};


const mapDispatchToProps = (dispatch) => {
    return {
        onRescan: (path) => {
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
                if (!paths) {
                    return;
                }

                paths.forEach(path => {
                    dispatch(pathAdded(path));
                    dispatch(scanForRoms(path))
                });
            })
        },
        onRemoveRom: (rom) => {
            dispatch(removeRom(rom))
        },
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);
