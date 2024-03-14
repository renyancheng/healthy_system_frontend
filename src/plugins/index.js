/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import vuetifyDialogConfig from "./vuetify-dialog";
import { Vuetify3Dialog } from "vuetify3-dialog";
import pinia from "@/store";
import router from "@/router";
import dayjs from "./day.js"

export function registerPlugins(app) {
  app.config.globalProperties.$dayjs = dayjs;
  app
    .use(vuetify)
    .use(Vuetify3Dialog, vuetifyDialogConfig)
    .use(router)
    .use(pinia)
}
