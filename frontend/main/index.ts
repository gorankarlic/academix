import {createApp} from "vue";
import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router";
import App from "./App.vue";
import Home from "./Home.vue";
import "virtual:uno.css";

const history = createWebHistory();
const routes: RouteRecordRaw[] =
[
    {
        component: Home,
        path: "/"
    }
];
const router = createRouter({history, routes});

const app = createApp(App);
app.use(router);
app.mount("#app");