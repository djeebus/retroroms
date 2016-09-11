import {app, BrowserWindow} from 'electron';
import {basename} from 'path';

app.devMode = process.argv.findIndex(a => a == '--dev') != -1;

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
  const forceDownload = true;
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

async function createWindow () {
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
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
