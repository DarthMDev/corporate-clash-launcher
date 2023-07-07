import Axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {app} from 'electron';
import {isRenderer} from "./helpers";
import {ipcMain, ipcRenderer} from "electron-better-ipc";

const headers: { [name: string]: string } = {};

class OurAxios {
    isRender = false;
    _internalAxios: AxiosInstance;

    constructor() {
        if (isRenderer()) {
            // @ts-ignore
            this._internalAxios = null;
            this.isRender = true;
        }
        else {
            headers["User-Agent"] = `Mozilla/5.0 CorporateClashLauncher/${app.getVersion()}`;
            this._internalAxios = Axios.create({
                headers: headers,
                timeout: 10000,
                baseURL: 'https://corporateclash.net/api/',
                validateStatus: (status => {
                    return (status >= 200 && status <= 499);
                })
            });
        }
    }

    async get(uri: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (this.isRender) {
            // @ts-ignore
            return await ipcRenderer.callMain("get-axios", {uri: uri, config: config});
        }
        return await this._internalAxios.get(uri, config);
    }

    async post(uri: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (this.isRender) {
            // @ts-ignore
            return await ipcRenderer.callMain("post-axios", {uri: uri, data: data, config: config});
        }
        return await this._internalAxios.post(uri, data, config);
    }
}

const OurAxiosInstance = new OurAxios();

if (!isRenderer()) {
    // @ts-ignore
    ipcMain.answerRenderer('get-axios', async (config: {uri: string, config?: AxiosRequestConfig}) => {
        return await OurAxiosInstance.get(config.uri, config.config)
    });
    // @ts-ignore
    ipcMain.answerRenderer('post-axios', async (config: {uri: string, data?: any, config?: AxiosRequestConfig}) => {
        return await OurAxiosInstance.post(config.uri, config.data, config.config)
    });
}


export default OurAxiosInstance;
