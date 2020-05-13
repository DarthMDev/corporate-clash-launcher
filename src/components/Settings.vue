<template>
    <div class="overlay">
        <div class="settingsbox">
            <img class="settingsBackground" src="../assets/art/settings/settings.png">
            <h1 class="settings_header">Settings</h1>
            <div class="settingscontainer">
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
                <p>FFFFFFFFFFFF</p>
                <br>
            </div>
            <button class="settingsCloseButton" @click="closeClicked"><img @click="closeClicked"
                                                                           src="../assets/art/settings/settingsclosenew.png">
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component
    export default class Settings extends Vue {
        closeClicked() {
            console.log("fff")
            this.$emit('closeClicked')
        }
    }
</script>

<style lang="scss">
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: block;
        z-index: 2;
    }

    .settingsbox {
        position: fixed;
        left: 260px;
        top: 30px;
        z-index: 5;
    }

    .settingsBackground {
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .settingsCloseButton {
        position: fixed;
        margin-left: -52px;
        -webkit-user-select: none;
        -webkit-user-drag: none;
        background-color: transparent;
        border: none;
        z-index: 15;
    }

    .settings_header {
        position: fixed;
        top: 40px;
        margin-left: 90px;
        font-family: 'Impress BT', Fallback, sans-serif;
        color: #f8f8f8;
        text-shadow: black;
    }

    .settingscontainer {
        position: fixed;
        z-index: 6;
        top: 110px;
        margin-left: 35px;
        height: 385px;
        width: 248px;
        overflow: auto;
        -webkit-app-region: no-drag;
    }

    @import "../mixin-scrollbar";
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px lightgrey;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: lightgrey;
    }
</style>
