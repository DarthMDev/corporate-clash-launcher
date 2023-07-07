<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <div @click="twitterClicked" class="twitterButton"/>
        <div @click="ytClicked" class="ytButton"/>
        <div @click="discordClicked" class="discordButton"/>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-facing-decorator'
    import {shell} from 'electron';

    @Component({
        name: 'Buttons',
    })
    export default class Buttons extends Vue {
        twitterClicked() {
            shell.openExternal("https://corporateclash.net/social/twitter")
        }

        ytClicked() {
            shell.openExternal("https://corporateclash.net/social/youtube")
        }

        discordClicked() {
            shell.openExternal("https://corporateclash.net/social/discord")
        }
    }
</script>

<style scoped>
    .twitterButton {
        position: absolute;
        bottom: 77px;
        width: 36px;
        height: 36px;
        right: 131px;
        z-index: 1;
        -webkit-app-region: no-drag;
        background-image: url("../assets/art/ext_btns/twitter_normal.png");
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .ytButton {
        position: absolute;
        bottom: 77px;
        right: 181px;
        width: 36px;
        height: 36px;
        z-index: 1;
        background-image: url("../assets/art/ext_btns/yt_normal.png");
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .discordButton {
        position: absolute;
        bottom: 77px;
        right: 231px;
        width: 36px;
        height: 36px;
        z-index: 1;
        background-image: url("../assets/art/ext_btns/discord_normal.png");
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .twitterButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/twitter_hover.png");
    }

    .ytButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/yt_hover.png");
    }

    .discordButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/discord_hover.png");
    }

    .twitterButton:active {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/twitter_down.png");
    }

    .ytButton:active {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/yt_down.png");
    }

    .discordButton:active {
        cursor: pointer;
        background-image: url("../assets/art/ext_btns/discord_down.png");
    }


</style>
