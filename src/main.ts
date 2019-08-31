import * as Sentry from '@sentry/browser';
const isDevelopment = process.env.NODE_ENV !== 'production';
if (!isDevelopment) {
    Sentry.init({ dsn: 'https://1c9e1b56059a4408a338be2d7ae0af69@sentry.io/1547187' });
}

import _ from 'lodash';
import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
