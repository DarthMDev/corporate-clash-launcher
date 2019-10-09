<template>
    <div>
        <p class="statusText" v-text="statustext"/>
        <div :hidden="progress <= 0 || progress >= 100" class="progressPos">
            <div class="progress">
                <div :style="{'width': `${progress}%`}" class="progressBar"
                     id="progressBar">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {ipcRenderer} from 'electron-better-ipc';
    import {remote} from "electron";

    @Component({
        name: 'DownloadProgress',
    })
    export default class DownloadProgress extends Vue {
        statustext = "Ready to go!";
        progress = 1;

        mounted() {
            // @ts-ignore
            ipcRenderer.answerMain("set-status", async (text: string) => {
                this.statustext = text;
                return true;
            });
            // @ts-ignore
            ipcRenderer.answerMain("update-progress", async (progress: number) => {
                this.statustext = `Downloading: ${progress}%`;
                this.progress = progress;
                remote.getCurrentWindow().setProgressBar(progress / 100);
                return true;
            });
        }
    }
</script>

<style scoped>
    .progress {
        width: 165px;
        height: 15px;
        margin-bottom: 20px;
        overflow: hidden;
        background-color: #8a9ba5;
        border-radius: 8px;
        -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
    }

    .progressBar {
        height: 100%;
        color: #fff;
        background-color: #337ab7;
        -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
        -webkit-transition: width .6s ease;
        -o-transition: width .6s ease;
        transition: width .6s ease
    }

    .progressPos {
        position: absolute;
        right: 210px;
        bottom: 157px;
    }

    .statusText {
        position: absolute;
        font-size: 15pt;
        text-align: right;
        bottom: 130px;
        right: 210px;
        z-index: 1;
        font-family: 'Impress BT', Fallback, sans-serif;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
</style>
