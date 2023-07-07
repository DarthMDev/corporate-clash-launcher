// source: https://github.com/jprichardson/is-electron-renderer/blob/master/index.js
import path from "path";
import fs from "fs-extra";

export function isRenderer() {
    // running in a web browser
    if (typeof process === 'undefined') return true;

    // node-integration is disabled
    if (!process) return true;

    // We're in node.js somehow
    if (!process.type) return false;

    return process.type === 'renderer'
}


export function mkdirIfNotExist(...paths: string[]) {
    let dir = path.join(...paths);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
