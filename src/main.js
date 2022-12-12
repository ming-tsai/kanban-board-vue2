import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./quasar";
import VueDraggable from "vue-draggable";

Vue.config.productionTip = false;

Vue.use(VueDraggable);
new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
