import electron from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {scanForRoms, pathAdded, removeRom, identifyRom} from '../redux/actions';
import { play } from '../api';


require('./settings.scss');


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

        let classes = [
            'rom',
            rom.isIdentified ? 'identified' : 'unidentified',
        ];
        return (
            <li key={rom.path} className={classes.join(' ')}>
                {rom.name || rom.path}&nbsp;
                <button onClick={() => play(rom)}>Play</button>
                <button onClick={() => this.props.onRemoveRom(rom)}>
                    Remove
                </button>
                <button onClick={() => this.props.onIdentifyRom(rom)}>
                    Refresh Metadata
                </button>
            </li>
        );
    }
}


const Settings = ({paths, romsByConsole, onGetPath, onRescan,
                   onRemoveRom, onIdentifyRom}) => {
    let consoleKeys = Object.keys(romsByConsole);
    consoleKeys.sort();

    return (
        <div id="settings">
            <h1>Paths</h1>
            <ul>
                {paths.map(path => <Path key={path} path={path}
                                         onRescan={onRescan} />)}
            </ul>

            <button onClick={onGetPath}>Open Path</button>

            {consoleKeys.map(c => {
                let roms = romsByConsole[c];

                return (
                    <div key={c}>
                        <h1>{c ? c : "Unidentified ROMs"}</h1>
                        <ul>
                            {roms.map(rom =>
                                <Rom key={rom.path} rom={rom}
                                     onRemoveRom={onRemoveRom}
                                     onIdentifyRom={onIdentifyRom} />)}
                        </ul>
                    </div>);
            })}

        </div>
    );
};


const mapStateToProps = ({paths, roms}) => {
    let romsByConsole = {};
    roms.forEach(r => {
        if (r.console in romsByConsole) {
            romsByConsole[r.console].push(r);
        } else {
            romsByConsole[r.console] = [r];
        }
    });

    return {paths, romsByConsole};
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
        onIdentifyRom: (rom) => {
            dispatch(identifyRom(rom))
        },
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);
