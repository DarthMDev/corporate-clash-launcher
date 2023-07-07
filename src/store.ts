import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {defineStore} from "pinia";
const app = createApp({})
app.use(createPinia())

export interface AppState {
    progressBar: Number,

}
export const useStore = defineStore({
    id: 'main', // a unique id for the store
    state: () => ({
      progressBar: 0
    }),
    actions: {
      setProgressBar(n: number) {
        this.progressBar = n;
        require("@electron/remote").getCurrentWindow().setProgressBar(n / 100);
        if (n >= 100 || n <= 0) {
          require("@electron/remote").getCurrentWindow().setProgressBar(-1);
        }
      }
    }
  })
