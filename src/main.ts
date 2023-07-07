import * as Sentry from '@sentry/browser';
const isDevelopment = process.env.NODE_ENV !== 'production';
if (!isDevelopment) {
    Sentry.init({ dsn: 'https://1c9e1b56059a4408a338be2d7ae0af69@sentry.io/1547187' });
}

import _ from 'lodash';
import { createApp } from 'vue' 
import App from './App.vue'
import { createPinia } from 'pinia'

// import the store from the store.ts file
import { useStore} from './store'

// create the app and pass the store to it
const app = createApp(App)
app.use(createPinia())
app.mount('#app')
