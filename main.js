import {app, BrowserWindow} from 'electron';
import {basename} from 'path';
import parseMameContent from './mame';

app.devMode = process.argv.findIndex(a => a == '--dev') != -1;
app.machines = {};
app.machinesByRom = {};

if (app.devMode) {
  require('electron-debug')();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


const installExtensions = async () => {
  if (!app.devMode) {
    console.log('not in dev mode')
    return;
  }
  const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = false;
  for (const name of extensions) {
    console.log(`installing ${name} ... `);
    try {
      await installer.default(installer[name], forceDownload);
      console.log(`done installing ${name} ... `);
    } catch (e) {
      console.error(`error installing ${name}`, e);
    } // eslint-disable-line
  }
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function () {
  console.log('installing extensions');
  await installExtensions();
  console.log('extensions installed');

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();

  });

  // Open the DevTools.
  if (app.devMode) {
    mainWindow.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  let machineCount = 0;
  parseMameContent(function (machine) {
    app.machines[machine.name] = machine;
    machine.roms.forEach(rom => {
      if (rom.name in app.machinesByRom) {
        app.machinesByRom[rom.name].push(machine);
      } else {
        app.machinesByRom[rom.name] = [machine];
      }
    });

    machineCount++;
    if (machineCount % 100 == 0) {
      console.log('machines: ', machineCount);
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
});
