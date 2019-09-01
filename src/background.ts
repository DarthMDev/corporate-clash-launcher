const isDevelopment = process.env.NODE_ENV !== 'production';
if (!isDevelopment) {
    require("@sentry/node").init({ dsn: 'https://6214261e7b08411b89ea13ecf3f864a0@sentry.io/1547181' });
}

import {ipcMain} from "electron-better-ipc";
import {app, BrowserWindow, protocol} from 'electron'
import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib'
import path from 'path';
import {Downloader} from "./downloader";
import {AxiosRequestConfig} from "axios";
import {baseDir} from "./constantsMain";
import {spawn} from 'child_process';


import Axios from "./axios";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 845,
        height: 565,
        frame: false,
        transparent: true,
        resizable: false,
        maximizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) win.webContents.openDevTools({mode: "detach"})
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
        process.exit(0);
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installVueDevtools()
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

// TODO: realms
let downloader = new Downloader("production");
downloader.setBaseDirectory(baseDir);
// Begin download handler

ipcMain.answerRenderer('populate-manifest', async () => {
    await downloader.populateManifest();
    return true
});

ipcMain.answerRenderer('focus', async () => {
    setTimeout(() => {
        if (win) {
            win.focus();
        }
    });
    return true
});

ipcMain.answerRenderer('check-download', async () => {
    if (win) {
        ipcMain.callRenderer(win, "set-status", "Checking files...");
    }
    return await downloader.downloadToFolder(async (progress) => {
        // @ts-ignore
        if (win) {
            ipcMain.callRenderer(win, 'update-progress', progress).catch(() => {}).then(() => {});
        }
    }).then(result => {
        if (win) {
            ipcMain.callRenderer(win,"set-status", "Have fun!");
        }
        return result;
    });
});

// @ts-ignore
ipcMain.answerRenderer("start-game", async (config: {token: string, hostname: string, minimize: boolean}) => {

    console.log("Should start game");
    let command;
    switch (process.platform) {
        case "win32":
            command = "CorporateClash.exe";
            break;
        case "darwin":
            command = "Corporate Clash";
            break;
        default:
            command = "Corporate Clash";
    }
    let clashProcess = spawn(command, {
        cwd: baseDir,
        env: {
            "TT_GAMESERVER": config.hostname,
            "TT_PLAYCOOKIE": config.token,
        },
        shell: false,
    });
    if (win) {
        config.minimize ? win.minimize() : win.hide();
    }
    clashProcess.on('close', (code) => {
        if (win) {
            config.minimize ? win.maximize() : win.show();
        }
    });
    return true;
});
