import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import i18n from "./i18n";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import router from "./router";

const app = createApp(App);

app.use(i18n);
app.use(Toast);
app.use(router);
app.mount("#app");
