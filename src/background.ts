const isDevelopment = process.env.NODE_ENV !== 'production';
if (!isDevelopment) {
    require("@sentry/node").init({dsn: 'https://6214261e7b08411b89ea13ecf3f864a0@sentry.io/1547181'});
}
require('@electron/remote/main').initialize()
import ClashUpdater from "./ClashUpdater";
import log from './logger';

(new ClashUpdater()).check();
import {ipcMain} from "electron-better-ipc";
import {app, BrowserWindow, protocol} from 'electron';
import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';
import {Downloader} from "./downloader";
import {baseDir, baseDirQa} from "./constantsMain";
import {spawn} from 'child_process';

log.info("Starting Application");
log.info(`Corporate Clash Launcher v${app.getVersion()}`);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

function createWindow() {
    log.info("Creating window...");
    // Create the browser window.
    win = new BrowserWindow({
        width: 845,
        height: 565,
        frame: false,
        transparent: true,
        resizable: false,
        maximizable: false,
        icon: path.join(__dirname, 'assets/icons/png/512x512.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        log.info("DEV MODE: WEBPACK_DEV_SERVER_URL set, so using devtools.");
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) win.webContents.openDevTools({mode: "detach"})
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        log.info("Window closed");
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    log.info("All windows closed");
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        log.info("Quitting app since we're not on a Mac.");
        app.quit();
        process.exit(0);
    } else {
        log.info("Launcher is staying open, but without a window, due to MacOS functionality expectations.");
    }
});

app.on('activate', () => {
    log.info("Application activate");
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        log.info("Creating window since win was null");
        createWindow()
    } else {
        log.info("Received activate even with an existing window object.");
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    log.info("Window ready");
    if (isDevelopment && !process.env.IS_TEST) {
        log.info("Installing devtools");
        // NOT installing vue devtools due to it corrupting the chromium cache (i guess)
        try {
            //installVueDevtools()
        } catch (e ) {
            if (e instanceof Error) {
                log.error('Vue Devtools failed to install:', e.message);
            }
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


// Begin download handler

log.info("setting up listeners");

ipcMain.answerRenderer('focus', async () => {
    log.info("focus: asked to focus");
    setTimeout(() => {
        if (win) {
            win.focus();
        }
    });
    return true
});

interface checkDownloadOptions {
    qa?: boolean,
    qaUrl?: string,
}

// @ts-ignore
ipcMain.answerRenderer('check-download', async (options: checkDownloadOptions) => {
    log.info("check-download: Started download process");
    let downloader = new Downloader(options.qa ? "qa" : "production");
    if (options.qa && options.qaUrl) {
        downloader.setManifestUrl(options.qaUrl);
    }
    await downloader.populateManifest();
    let _basedir = options.qa ? baseDirQa : baseDir;
    log.info(`Base directory: ${_basedir} qa=${options.qa}`);
    downloader.setBaseDirectory(_basedir);
    if (win) {
        log.info("check-download: setting download status to checking files");
        ipcMain.callRenderer(win, "set-status", "Checking files...");
    }
    return await downloader.downloadToFolder(async (progress) => {
        if (win) {
            ipcMain.callRenderer(win, 'update-progress', progress).catch(() => {
            }).then(() => {
            });
        }
    }).then(result => {
        log.info("check-download: received result success from download worker");
        if (win) {
            ipcMain.callRenderer(win, "set-status", "Have fun!");
        }
        return result;
    });
});

// @ts-ignore
ipcMain.answerRenderer("start-game", async (config: { token: string, hostname: string, minimize: boolean, qa: boolean }) => {
    log.info(`start-game: Should start game. qa=${config.qa}`);
    let command;
    switch (process.platform) {
        case "win32":
            log.info("start-game: windows using CorporateClash.exe");
            command = "CorporateClash.exe";
            break;
        case "darwin":
            log.info("start-game: MacOS using Corporate Clash");
            command = "Corporate Clash";
            break;
        default:
            log.info("start-game: WARNING DEFAULT CASE, using Corporate Clash");
            command = "Corporate Clash";
    }
    log.info("start-game: spawning process");
    let clashProcess = spawn(command, {
        cwd: config.qa ? baseDirQa : baseDir,
        env: {
            "TT_GAMESERVER": config.hostname,
            "TT_PLAYCOOKIE": config.token,
        },
        shell: false,
    });
    log.info(`start-game: process ${clashProcess.pid}`);
    setTimeout(() => {
        log.info("start-game: done waiting 2000 milliseconds before performing window obfuscation");
        if (win) {
            log.info("start-game: minimizing window if 2 or more accounts loaded, hiding if 1 account");
            config.minimize ? win.minimize() : win.hide();
        }
    }, 2000);
    clashProcess.on('close', (code) => {
        log.info("start-game: received close event from scoped game process");
        if (win) {
            log.info("start-game: maximizing window if 2 or more accounts loaded, showing previously-hidden if 1 account");
            config.minimize ? win.maximize() : win.show();
            win.moveTop();
        }
    });
    return true;
});
