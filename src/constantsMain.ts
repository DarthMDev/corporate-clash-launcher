import path from 'path';

// @ts-ignore
export let baseDir = process.platform == "darwin" ? path.join(process.env.HOME, '/Library/Application Support/Corporate Clash 2019') : path.join(process.env.localappdata, 'Corporate Clash 2019');
