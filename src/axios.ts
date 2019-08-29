import Axios from "axios";
import {app} from 'electron';

let headers: { [name: string]: string } = {};

// we can only set user-agent in main process due to axios
headers["User-Agent"] = `Mozilla/5.0 CorporateClashLauncher/${app.getVersion()}`;



export default Axios.create({
    headers: headers,
    timeout: 10000,
    baseURL: 'https://corporateclash.net/api/',
})

