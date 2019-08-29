<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <img class="newsBackground" src="../assets/art/misc/news.png"/>
        <div class="newsDiv">
            <ul class="newsUl">
                <li v-for="(article, index) in articles" v-bind:key="article.id">
                    <h3 class="articleHeader" v-text="article.title" @click="articleClicked(article.id)"/>
                    <p><article-date :date="article.posted" /></p>
                    <p v-text="article.summary"/>
                    <hr v-if="index + 1 < articles.length">
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {ipcRenderer} from 'electron-better-ipc';
    import {shell} from 'electron';
    import ArticleDate from "@/components/ArticleDate.vue"

    export default {
        name: 'News',
        components: {ArticleDate},
        data() {
            return {
                articles: []
            }
        },
        methods: {
            articleClicked(id: Number) {
                shell.openExternalSync(`https://corporateclash.net/news/article/${id}`);
            }
        },
        mounted() {
            ipcRenderer.callMain('get-axios', 'v1/launcher/news').then(res => {
                // @ts-ignore
                this.articles = res.data;
            })
        },
    }
</script>

<style scoped>
    p {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    h3 {
        margin-top: 10px;
        margin-bottom: 8px;
    }

    .articleHeader:hover {
        cursor: pointer;
    }

    .newsBackground {
        position: absolute;
        bottom: 65px;
        left: 63px;
        z-index: 1;
        -webkit-app-region: no-drag;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .newsUl {
        list-style-type: none;
        font-family: 'Impress BT', Fallback, sans-serif;
        scroll-behavior: smooth;
        scrollbar-width: thin;
        width: 243px;
        height: 321px;
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 6px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        margin-top: 2px;
        margin-bottom: 2px;
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        margin-top: 2px;
        margin-bottom: 2px;
        background: grey;
        border-radius: 10px;
    }

    .newsDiv {
        position: absolute;
        height: 342px;
        width: 260px;
        left: 54px;
        top: 144px;
        z-index: 2;
    }
</style>
