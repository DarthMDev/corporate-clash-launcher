import path from 'path';
import {app} from 'electron';

export let configdir = process.platform == "darwin" ? app.getPath('userData') : process.env.APPDATA!;


let _absolute_base = process.platform == "darwin" ? path.join(process.env.HOME!, '/Library/Application Support/Corporate Clash 2019') : process.env.localappdata!;
export let baseDir = path.join(_absolute_base, 'Corporate Clash 2019');
export let baseDirQa = path.join(_absolute_base, 'Corporate Clash 2019 QA');
