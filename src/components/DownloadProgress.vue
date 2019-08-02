<template>
    <div class="progressPos" :hidden="this.progress <= 0 || this.progress >= 100">
        <div class="progress">
            <div id="progressBar" class="progressBar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                 :style="{'width': `${this.progress}%`}">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'DownloadProgress',
        computed: {
            progress(): Number {
                // @ts-ignore
                return this.$store.state.progressBar;
            }
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
</style>
