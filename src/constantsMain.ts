import path from 'path';
export let baseDir = './'
export let baseDirQa = './'
// @ts-ignore
let _absolute_base = process.platform == "darwin" ? path.join(process.env.HOME, '/Library/Application Support/Corporate Clash') : process.env.localappdata;
if (_absolute_base != undefined) {
    let baseDir = path.join(_absolute_base, 'Corporate Clash');
    let baseDirQa = path.join(_absolute_base, 'Corporate Clash QA');
}