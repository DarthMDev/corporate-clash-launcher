<!--suppress CheckEmptyScriptTag -->
<template>
    <div id="app">
        <img v-if="useFlat2" class="bg-img" alt="background image" src="./assets/art/flat.png">
        <img v-else class="bg-img" alt="background image" src="./assets/art/flat_only_username.png">
        <window-buttons/>
        <login-buttons/>
        <download-progress/>
        <news/>
        <buttons/>
    </div>
</template>

<script lang="ts">
    import WindowButtons from "@/components/WindowButtons.vue";
    import LoginButtons from "@/components/LoginButtons.vue";
    import DownloadProgress from "@/components/DownloadProgress.vue"
    import News from "@/components/News.vue"
    import Buttons from "@/components/Buttons.vue"

    export default {
        name: "App",
        components: {
            Buttons,
            News,
            DownloadProgress,
            LoginButtons,
            WindowButtons
        },
        data() {
            return {
                useFlat2: false
            }
        },
        methods: {
            useOldBackground() {
                // @ts-ignore
                this.useFlat2 = true;
            },
            useRegularBackground() {
                // @ts-ignore
                this.useFlat2 = true;
            }
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
