<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <div v-if="showAddAccount">
            <div class="loginUsername">
                <input v-model="addUsername" id="username" class="loginUsernameText" type="text"/>
                <img class="loginUsernameImage" src="../assets/art/misc/field_user.png"/>
            </div>
            <div class="loginPassword">
                <input v-model="addPassword" id="password" class="loginPasswordText" type="password"/>
                <img class="loginPasswordImage" src="../assets/art/misc/field_user.png"/>
            </div>
            <div :class="{'addButtonDisabled': !canAdd}" :disabled="!canAdd" @click="addClicked"
                 class="playButton addButton"/>
        </div>
        <div v-else>
            <div class="loginUsername">
                <select @change="selectChanged" class="loginDropdown" v-model="selected">
                    <option></option>
                    <option :key="account" :name="account" v-for="account in accounts" v-text="account"/>
                    <option v-text="addText"/>
                    <!-- TODO: list accounts -->
                    <!-- TODO: Dedicated buttons for removing and adding accounts -->
                </select>
            </div>
            <div :class="{'playButtonDisabled': !canPlay}" :disabled="!canPlay" @click="playClicked"
                 class="playButton"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Accounts from '@/authentication';

    export default {
        name: 'LoginButtons',
        data() {
            return {
                addUsername: "",
                addPassword: "",
                addText: "+Add an account",
                selected: "",
                canPlay: false,
                canAdd: true,
                showAddAccount: false,
                modal: false,
                accounts: [],
            }
        },
        mounted() {
            // @ts-ignore
            this.refreshAccounts();
        },
        methods: {
            refreshAccounts() {
                // @ts-ignore
                this.accounts = Accounts.getAccountUsernames();
            },

            selectChanged() {
                // @ts-ignore
                let selected: string = this.selected;
                // @ts-ignore
                this.canPlay = !(selected == "" || selected == this.addText);
                // @ts-ignore
                if (selected == this.addText) {
                    // @ts-ignore
                    this.selected = "";
                    // @ts-ignore
                    this.showAddAccount = true;
                    // @ts-ignore
                    this.$parent.useOldBackground();
                    // @ts-ignore
                    this.canPlay = true;
                }
            },

            addClicked() {

            },

            playClicked() {
                // @ts-ignore
                if (!this.canPlay) {
                    return;
                }
                // @ts-ignore
                let selected: string = this.selected;

                let account = Accounts.getAccountByUsername(selected);
                account.login().then(res => {
                    alert(res.message)
                })
                //ipcRenderer.callMain("check-download").then(() => {
                //    // TODO: login logic
                //});
            }
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

    .loginUsernameText {
        position: absolute;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        bottom: 245px;
        right: 84px;
        width: 172px;
        z-index: 2;
        font-family: 'Impress BT', Fallback, sans-serif;
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
        border: none;
        background-color: rgba(0, 0, 0, 0);
        bottom: 212px;
        right: 84px;
        width: 172px;
        z-index: 2;
    }

</style>
