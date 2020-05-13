<!--suppress CheckEmptyScriptTag -->
<template>
    <div id="app">
        <img alt="background image" class="bg-img" src="./assets/art/flat_user_password_friendly.png" v-if="useFlat2">
        <img alt="background image" class="bg-img" src="./assets/art/flat_only_username.png" v-else>
        <window-buttons/>
        <login-buttons @wantOldBackground="useOldBackground" @wantRegularBackground="useRegularBackground"/>
        <download-progress/>
        <news/>
        <buttons @openSettings="showSettings"/>
        <p class="versionBox" v-text="AppVersion"/>
        <settings class="settings" v-show="showSettingsToggle" @closeClicked="hideSettings"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import WindowButtons from "@/components/WindowButtons.vue";
    import LoginButtons from "@/components/LoginButtons.vue";
    import DownloadProgress from "@/components/DownloadProgress.vue"
    import News from "@/components/News.vue"
    import Buttons from "@/components/Buttons.vue"
    import {remote} from 'electron';
    import Settings from "@/components/Settings.vue";

    @Component({
        name: "App",
        components: {
            Settings,
            Buttons,
            News,
            DownloadProgress,
            LoginButtons,
            WindowButtons
        }
    })
    export default class App extends Vue {
        useFlat2 = false;
        showSettingsToggle = false;

        showSettings() {
            this.showSettingsToggle = true;
        }

        hideSettings() {
            this.showSettingsToggle = false;
        }

        get AppVersion() {
            return 'v' + remote.app.getVersion();
        }

        useOldBackground() {
            this.useFlat2 = true;
        }

        useRegularBackground() {
            this.useFlat2 = false;
        }
    }
</script>

<style lang="scss">

    @font-face {
        font-family: 'Impress BT';
        src: url('./assets/font/ImpressBT-Regular.woff2') format('woff2'),
        url('./assets/font/ImpressBT-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: 'Mickey';
        src: url('./assets/font/Mickey.woff2') format('woff2'),
        url('./assets/font/Mickey.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }


    .versionBox {
        color: lightgray;
        font-size: 15pt;
        font-family: 'Impress BT', Fallback, sans-serif;
        position: absolute;
        top: 475px;
        left: 370px;
    }
    .bg-img {
        position: relative;
        z-index: 0;
        -webkit-app-region: drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
