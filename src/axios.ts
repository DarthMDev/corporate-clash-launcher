import Axios from "axios";
let nodeAdapter = require('axios/lib/adapters/http');
import {remote} from 'electron';

Axios.defaults.adapter = nodeAdapter;

export default Axios.create({
    headers: {
        'User-Agent': `Mozilla/5.0 CorporateClashLauncher/${remote.app.getVersion()}`
    },
    timeout: 10000,
    baseURL: 'https://corporateclash.net/api/',
    adapter: nodeAdapter,
})
