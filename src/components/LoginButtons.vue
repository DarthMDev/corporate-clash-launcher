<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <div class="loginUsername">
            <select class="loginDropdown">
                <option></option>
                <!-- TODO: list accounts -->
                <!-- TODO: Dedicated buttons for removing and adding accounts -->
            </select>
        </div>
        <div class="playButton" @click="playClicked" />
    </div>
</template>

<script lang="ts">
    import {ipcRenderer} from 'electron-better-ipc';
    import {Accounts} from '@/authentication'
    export default {
        name: 'LoginButtons',
        methods: {
            playClicked() {
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
