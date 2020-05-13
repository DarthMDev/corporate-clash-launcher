<!--suppress CheckEmptyScriptTag -->
<template>
    <div>
        <img class="newsBackground" src="../assets/art/misc/news.png"/>
        <div class="newsDiv">
            <ul class="newsUl">
                <li v-bind:key="article.id" v-for="(article, index) in articles">
                    <h3 @click="articleClicked(article.id)" class="articleHeader" v-text="article.title"/>
                    <p>
                        <article-date :date="article.posted"/>
                    </p>
                    <p v-text="article.summary"/>
                    <hr v-if="index + 1 < articles.length">
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {shell} from 'electron';
    import ArticleDate from "@/components/ArticleDate.vue"
    import Axios from '@/axios'

    @Component({
        name: 'News',
        components: {
            ArticleDate
        },
    })
    export default class News extends Vue {
        articles = [];

        articleClicked(id: Number) {
            shell.openExternalSync(`https://corporateclash.net/news/article/${id}`);
        }

        mounted() {
            Axios.get('v1/launcher/news').then(res => {
                // @ts-ignore
                this.articles = res.data;
            })
        }
    }
</script>

<style lang="scss" scoped>
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

    @import "../mixin-scrollbar";

    .newsDiv {
        position: absolute;
        height: 342px;
        width: 260px;
        left: 54px;
        top: 144px;
        z-index: 2;
    }
</style>
