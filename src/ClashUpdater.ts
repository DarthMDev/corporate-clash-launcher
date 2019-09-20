import {autoUpdater} from "electron-updater"
import log from './logger';

export default class AppUpdater {
    async check() {
        log.transports.file.level = "debug";
        autoUpdater.logger = log;
        await autoUpdater.checkForUpdatesAndNotify()
    }
}
