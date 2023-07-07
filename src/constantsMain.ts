import path from 'path';
export const baseDir = './'
export const baseDirQa = './'
// @ts-ignore
const _absolute_base = process.platform == "darwin" ? path.join(process.env.HOME, '/Library/Application Support/Corporate Clash') : process.env.localappdata;
if (_absolute_base != undefined) {
    const baseDir = path.join(_absolute_base, 'Corporate Clash');
    const baseDirQa = path.join(_absolute_base, 'Corporate Clash QA');
}