import ElectronStore from "electron-store";
import Axios from "./axios";

interface loginResponse {
    status: boolean,
    toonstep: boolean,
    message: string,
    token: string,
}

interface MetadataResponse {
    access_qa: boolean,
    bad_token: boolean,
    qa_manifest_url: string,
    qa_hostname: string,
}

class Account {
    username = '';
    token = '';
    friendly = '';
    private metadataResponse: MetadataResponse | null = null;

    async metadata(forceReload = false): Promise<MetadataResponse> {
        if (!this.metadataResponse || forceReload) {
            this.metadataResponse = await this._metadata();
        }
        return this.metadataResponse;
    }

    constructor(username: string, token: string, friendly: string = '') {
        this.username = username;
        this.token = token;
        this.friendly = friendly;
    }

    async login(qa: boolean): Promise<loginResponse> {
        return Axios.post('launcher/v1/login', {}, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "x-realm": qa ? 'qa' : 'production',
            }
        }).then(res => {
            return res.data;
        })
    }

    private async _metadata(): Promise<MetadataResponse> {
        return Axios.get('launcher/v1/metadata', {headers: {"Authorization": `Bearer ${this.token}`}}).then(res => {
            return res.data;
        })
    }


}

export class Accounts {
    store: ElectronStore<unknown>;
    accountList: Account[];

    constructor() {
        this.store = new ElectronStore({
            name: "accounts",
            fileExtension: "json",
        });
        this.accountList = [];
        // @ts-ignore
        this.store.get("accounts", []).forEach(accountData => {
            this.accountList.push(new Account(accountData.username, accountData.token));
        });
    }
    _saveAccounts() {
        this.store.set('accounts', this.accountList);
    }

    getAccountByUsername(username: string): Account {
        return this.accountList.filter(account => account.username == username)[0];
    }

    removeAccountByUsername(username: string) {
        this.accountList = this.accountList.filter(account => account.username !== username);
        this._saveAccounts();
    }

    getAccountUsernames(): string[] {
        return this.accountList.flatMap(account => account.username);
    }

    addAccount(username: string, token: string, friendly: string) {
        this.accountList.push(new Account(username, token, friendly));
        this._saveAccounts();
    }
}
export default new Accounts();
