import ElectronStore from "electron-store";
import Axios from "./axios";

interface loginResponse {
    status: boolean,
    toonstep: boolean,
    message: string,
    token: string,
}

class Account {
    username = '';
    token = '';
    friendly = '';

    constructor(username: string, token: string, friendly: string = '') {
        this.username = username;
        this.token = token;
        this.friendly = friendly;
    }

    async login(): Promise<loginResponse> {
        return Axios.post('launcher/v1/login', {}, {headers: {"Authorization": `Bearer ${this.token}`}}).then(res => {
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
        this.accountList.push(new Account(username, token));
        this._saveAccounts();
    }
}
export default new Accounts();
