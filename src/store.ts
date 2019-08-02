import Vue from 'vue';
import Vuex from 'vuex';
import {remote} from 'electron';
Vue.use(Vuex);

export interface AppState {
    progressBar: Number,

}

export default new Vuex.Store({
    state: {
        progressBar: 0
    },
    mutations: {
        setProgressBar(state, n) {
            remote.getCurrentWindow().setProgressBar(n / 100);
            if (n >= 100 || n <= 0) {
                remote.getCurrentWindow().setProgressBar(-1);
            }
            state.progressBar = n;
        }
    },
    actions: {}
})
