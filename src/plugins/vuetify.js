/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// import { md2 } from 'vuetify/blueprints'
import { createVuetify } from "vuetify";
import { VFab } from "vuetify/labs/VFab";
import { VEmptyState } from "vuetify/labs/VEmptyState";

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: "light",
      themes: {},
    },
    components: {
      VFab,
      VEmptyState
    },
    // blueprint: md2
  }
);
