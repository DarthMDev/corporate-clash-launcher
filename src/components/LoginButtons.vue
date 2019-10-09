<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <div v-if="showAddAccount">
            <form @keyup.enter="addClicked">
                <div class="loginUsername">
                    <input class="inputBox loginUsernameText" id="username" type="text" v-model="addUsername"/>
                </div>
                <div class="loginPassword">
                    <input class="inputBox loginPasswordText" id="password" type="password" v-model="addPassword"/>
                </div>
                <div style="position: relative">
                    <input class="inputBox loginFriendlyText" id="friendly" type="text" v-model="addFriendly"/>
                </div>
            </form>
            <div :disabled="!canAdd" @click="addClicked" class="addButton">
                <img :class="{'addButtonImgDisabled': !canAdd}" alt="add button" class="addButtonImg"
                     src="../assets/art/sub_btns/add.png">
            </div>
            <div @click="backClicked" class="backButton">
                <img alt="back button" class="backButtonImg" src="../assets/art/sub_btns/back.png">
            </div>
        </div>
        <div v-else>
            <div class="loginUsername">
                <select :disabled="disableUi" @change="selectChanged" class="loginDropdown" v-model="selected">
                    <option></option>
                    <option :key="account" :name="account" v-for="account in accounts" v-text="account"/>
                    <option v-text="addText"/>
                    <!-- TODO: Dedicated buttons for removing accounts -->
                </select>
            </div>
            <div :class="{'playButtonDisabled': !canPlay}" :disabled="disableUi || (!canPlay)" @click="playClicked"
                 class="playButton"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import Accounts from '@/authentication';
    import Axios from '@/axios';
    import {ipcRenderer} from 'electron-better-ipc';
    import {remote} from 'electron';

    @Component({
        name: "LoginButtons",
    })
    export default class LoginButtons extends Vue {
        addUsername: string = "";
        addPassword: string = "";
        addFriendly: string = "";
        addText = "+Add an account";
        selected = "";
        canQa = false;
        canPlay = false;
        disableUi = false;
        showAddAccount = false;
        accounts: string[] = [];

        get canAdd() {
            // Website requires  password between:6,64 and username between:3,40
            return this.addPassword.length >= 6 && this.addPassword.length <= 64
                && this.addUsername.length >= 3 && this.addUsername.length <= 40
                && this.addFriendly.length >= 3 && this.addFriendly.length <= 100
        }

        mounted() {
            this.refreshAccounts();
        }

        refreshAccounts() {
            this.accounts = Accounts.getAccountUsernames();
        }

        selectChanged() {
            let selected: string = this.selected;
            this.canPlay = !(selected == "" || selected == this.addText);
            if (selected == this.addText) {
                this.selected = "";
                this.showAddAccount = true;
                // @ts-ignore
                this.$parent.useOldBackground();
                this.canPlay = true;
                return;
            }
            if (selected != '') {
                let account = Accounts.getAccountByUsername(selected);
                account.metadata().then(res => {
                    if (res.bad_token) {
                        Accounts.removeAccountByUsername(account.username);
                        this.showMessageBox(`Your launcher has been deauthorized for the account ${account.username}.\nYou may re-add it via the add account option.`);
                        this.selected = '';
                        return;
                    }
                    this.canQa = res.access_qa;
                });
            }
        }

        showMessageBox(message: string) {
            remote.dialog.showMessageBox({
                title: "Corporate Clash Launcher",
                message: message,
            }).then(() => {
                ipcRenderer.callMain("focus");
            });
        }

        addClicked() {
            if (!this.canAdd) {
                this.showMessageBox("Please input a valid username, password, and \"friendly\" name for this launcher.\nThe friendly name is what you'll use to identify this launcher on the website.");
                return true;
            }
            if (this.accounts.includes(this.addUsername)) {
                this.showMessageBox("This account is already authorized to this launcher.\n You'll need to remove it before you can add it again.");
                return true;
            }
            Axios.post("launcher/v1/register", {
                'username': this.addUsername,
                'password': this.addPassword,
                'friendly': this.addFriendly,
            }).then(res => {
                let message = res.data.message || `${res.status} Failed without reason.`;
                if (!res.data.status) {
                    alert(message);
                    ipcRenderer.callMain("activate-window");
                    return;
                }
                Accounts.addAccount(this.addUsername, res.data.token, this.addFriendly);
                this.showMessageBox(message);
                this.backClicked();
                this.refreshAccounts();
            })
        }

        backClicked() {
            this.showAddAccount = false;
            // @ts-ignore
            this.$parent.useRegularBackground();
        }

        playClicked() {
            if (!this.canPlay) {
                return;
            }
            this.disableUi = true;
            this.canPlay = false;
            let selected: string = this.selected;

            // TODO: UI for wantQa
            let wantQa = false;

            let account = Accounts.getAccountByUsername(selected);
            account.login(wantQa).then(async (res) => {
                if (!res.status) {
                    this.showMessageBox(res.message);
                    return;
                }
                let metadata = await account.metadata();
                ipcRenderer.callMain("check-download", {qa: wantQa, qaUrl: metadata.qa_manifest_url}).then(() => {
                    ipcRenderer.send("set-status", "Have fun!");
                    ipcRenderer.callMain("start-game", {
                        token: res.token,
                        hostname: ((wantQa && metadata.access_qa) ? metadata.qa_hostname : 'gs.corporateclash.net'),
                        minimize: this.accounts.length >= 2
                    });
                    new Promise(resolve => setTimeout(() => resolve(), 2000)).then(() => {
                        this.disableUi = false;
                        this.canPlay = true;
                    });
                });
            });
        }
    }
</script>

<style scoped>
    input:focus {
        outline: 0;
    }

    .playButton {
        position: absolute;
        bottom: 140px;
        right: 73px;
        width: 115px;
        height: 71px;
        z-index: 1;
        background-image: url("../assets/art/play_btns/normal.png");
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }


    .addButton {
        position: absolute;
        bottom: 140px;
        right: 73px;
        width: 115px;
        height: 71px;
        z-index: 1;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .addButtonImg {
        max-width: 100%;
        max-height: 100%;
    }

    .addButtonImg:hover {
        cursor: pointer;
        filter: brightness(1.3);
    }

    .addButtonImgDisabled {
        filter: brightness(0.7);
    }

    .addButtonImgDisabled:hover {
        cursor: not-allowed;

        filter: brightness(0.7);
    }

    .backButton {
        position: absolute;
        bottom: 105px;
        right: 73px;
        width: 115px;
        height: 71px;
        z-index: 1;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .backButtonImg {
        max-width: 100%;
        max-height: 100%;
    }

    .backButtonImg:hover {
        cursor: pointer;
        filter: brightness(1.3);
    }

    .playButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/play_btns/hover.png");
    }

    .playButton:active {
        background-image: url("../assets/art/play_btns/down.png");
    }


    .playButtonDisabled {
        cursor: not-allowed;
    }

    .playButtonDisabled:hover {
        background-image: url("../assets/art/play_btns/normal.png");
        cursor: not-allowed;

    }

    .playButtonDisabled:active {
        background-image: url("../assets/art/play_btns/normal.png");
        cursor: not-allowed;
    }


    .loginUsername {
        position: relative
    }

    .loginUsernameImage {
        position: absolute;
        bottom: 240px;
        right: 80px;
        z-index: 1;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .inputBox {
        border-radius: 6px;
        background: #f8f8f8;
        border-color: #f5df0a;
        border-width: 2px;
        height: 17px;
        font-family: 'Impress BT', Fallback, sans-serif;
    }

    .loginUsernameText {
        position: absolute;
        bottom: 253px;
        right: 94px;
        width: 172px;
        z-index: 2;
        user-select: none;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .loginDropdown {
        position: absolute;
        bottom: 245px;
        right: 90px;
        width: 172px;
        z-index: 2;
        user-select: none;
        -webkit-app-region: no-drag;
    }


    .loginPassword {
        position: relative
    }

    .loginPasswordImage {
        position: absolute;
        bottom: 206px;
        right: 80px;
        z-index: 1;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .loginPasswordText {
        position: absolute;
        bottom: 225px;
        right: 94px;
        width: 172px;
        z-index: 2;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .loginFriendlyText {
        position: absolute;
        bottom: 196px;
        right: 94px;
        width: 135px;
        z-index: 2;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

</style>
