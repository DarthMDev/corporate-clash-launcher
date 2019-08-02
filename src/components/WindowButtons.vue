<template>
    <div>
        <div class="closeButton" @click="closeClicked"/>
        <div class="minButton" @click="minimizeClicked"/>
    </div>
</template>

<script lang="ts">
    import { remote } from 'electron'
    export default {
        name: 'WindowButtons',
        methods: {
            closeClicked() {
                remote.getCurrentWindow().close()
            },

            minimizeClicked() {
                remote.getCurrentWindow().minimize()
            }
        }
    }
</script>

<style scoped>
    .minButton {
        position: absolute;
        top: 15px;
        right: 125px;
        width: 60px;
        height: 29px;
        z-index: 1;
        -webkit-app-region: no-drag;
        background-image: url("../assets/art/min_btns/normal.png");
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .minButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/min_btns/hover.png");
    }

    .minButton:active {
        background-image: url("../assets/art/min_btns/down.png");
    }

    .closeButton {
        position: absolute;
        top: 15px;
        right: 60px;
        height: 29px;
        width: 60px;
        z-index: 1;
        background-image: url("../assets/art/close_btns/normal.png");
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .closeButton:hover {
        cursor: pointer;
        background-image: url("../assets/art/close_btns/hover.png");
    }
    .closeButton:active {
        background-image: url("../assets/art/close_btns/down.png");
    }
</style>
