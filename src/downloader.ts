import fs from 'fs';
import {promises as fsasync} from 'fs';
import path from 'path';
import Axios from "./axios";
import crypto from 'crypto';
import {mkdirIfNotExist} from "./helpers";
import md5file from "md5-file";
import got from "got";
import zlib from "zlib";


interface CallbackProgress {
    (progressOutOf100: number): void
}

interface _CallbackProgressFinished {
    (): void
}
interface _CallbackProgressDelta {
    (progressDelta: number): void
}

interface CallbackFinished {
    (): void
}

interface ManifestFile {
    hash: string,
    file: string,
}

interface ManifestFileObject {
    launcher: ManifestFile[],
    win32: ManifestFile[],
    darwin: ManifestFile[],
    game: ManifestFile[],
    resources: ManifestFile[],
}

interface ManifestRoot {
    base: string,
    files: ManifestFileObject,
}

export class Downloader {
    public realm: string;
    public manifestUrl: string;
    public manifest: ManifestRoot;
    public directory: string = "";
    private _defaultManifest = {base: "", files: {launcher: [], win32: [], darwin: [], game: [], resources: []}};

    constructor(realm: string = "production") {
        this.realm = realm;
        this.manifestUrl = `https://corporateclash.net/api/v1/launcher/manifest/${realm}.js`;
        this.manifest = this._defaultManifest;
    }

    public changeRealm(realm: string) {
        this.realm = realm;
        this.manifest = this._defaultManifest;
    }

    public setBaseDirectory(directory: string) {
        this.directory = directory;
        this.ensureStructure();
    }

    public ensureStructure() {
        mkdirIfNotExist(this.directory);
        if (process.platform === 'darwin') {
            mkdirIfNotExist(this.directory, 'Frameworks');
            mkdirIfNotExist(this.directory, 'Frameworks', 'Cg.framework');
        }
        mkdirIfNotExist(this.directory, 'resources');
        mkdirIfNotExist(this.directory, 'resources/contentpacks');
        mkdirIfNotExist(this.directory, 'resources/default');

    }

    public setManifestUrl(url: string) {
        this.manifestUrl = url;
        this.manifest = this._defaultManifest;
    }

    public async populateManifest() {
        this.manifest = await Axios.get(this.manifestUrl).then(res => {
            return res.data;
        })
    }

    public async downloadToFolder(callbackProgress: CallbackProgress): Promise<boolean> {
        let neededFiles: ManifestFile[] = [];

        let _files_to_check = this.manifest.files.game.concat(this.manifest.files.resources);
        if (process.platform === 'win32') {
            _files_to_check = _files_to_check.concat(this.manifest.files.win32);
        }
        else if (process.platform === 'darwin') {
            _files_to_check = _files_to_check.concat(this.manifest.files.darwin);
        }

        // iterate through the files of each of the 3 categories and download if they're out-of-date
        _files_to_check.forEach(async (file: ManifestFile) => {
            if (this.shouldDownloadFile(file)) {
                neededFiles.push(file);
            }
        });

        // Here hte progress will be in decimals where it counts to 1 (not 100)
        // the display will show the output of Math.floor(progress * 100)
        let progressDownloaded = 0;
        let progressNeeded = neededFiles.length;
        let _oldprogress = 0;
        let _newprogress = 0;

        let filesFinished = 0;

        if (neededFiles.length === 0) {
            return true;
        }
        let fnDownload = (file: ManifestFile) => {
            return this.downloadFile(file, (progressDelta => {
                _oldprogress = Math.floor((progressDownloaded / progressNeeded) * 100);

                progressDownloaded += progressDelta;

                _newprogress = Math.floor((progressDownloaded / progressNeeded) * 100);

                // Check if the difference of the lower bounds for the old and new percents yields a delta of 1
                // Sending useless updates breaks the UI
                if (_oldprogress < _newprogress) {
                    callbackProgress(_newprogress)
                }
            }))
        };
        return Promise.all(neededFiles.map(fnDownload)).then(() => {
            return true;
        });
    }

    private fullPathToFile(file: ManifestFile) {
        if (file.file.startsWith('phase_')) {
            return path.join(this.directory, 'resources', 'default', file.file)
        }
        if (file.file === 'Cg') {
            return path.join(this.directory, 'Frameworks', 'Cg.framework', file.file)
        }
        return path.join(this.directory, file.file);
    }

    // This is where we check the file to be in sync with manifest
    private shouldDownloadFile(file: ManifestFile) {
        let fullPath = this.fullPathToFile(file);
        if (!fs.existsSync(fullPath)) {
            return true;
        }
        // hash the real file on the system
        let existing_hash = md5file.sync(fullPath);
        return existing_hash !== file.hash;
    }

    private async downloadFile(file: ManifestFile, addToProgress: _CallbackProgressDelta): Promise<boolean> {
        let fullPath = this.fullPathToFile(file);

        // md5String is basically a salt for the GH filenames
        let md5String = 'TTCC-RELEASE-OBJECT-';
        let ghName = crypto.createHash('md5').update(md5String + file.file).digest('hex');

        let lastProgress = 0;
        // @ts-ignore
        let resp = await got.get(`${this.manifest.base}${ghName}`, {encoding: null}).on('downloadProgress', progress => {
            addToProgress(progress.percent - lastProgress);
            lastProgress = progress.percent;
        });
        addToProgress(1 - lastProgress);
        return fsasync.writeFile(fullPath, zlib.inflateSync(resp.body)).then(() => {
            return true
        });
    }
}
