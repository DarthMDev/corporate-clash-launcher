import ElectronStore from "electron-store";

class Account {
    username = '';
    token = '';
    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;
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

    getAccountByUsername(username: string) {
        return this.accountList.filter(account => account.username == username)[0];
    }

    getAccountUsernames() {
        return this.accountList.flatMap(account => account.username);
    }

    addAccount(username: string, token: string) {
        this.accountList.push(new Account(username, token));
        this._saveAccounts();
    }
}
