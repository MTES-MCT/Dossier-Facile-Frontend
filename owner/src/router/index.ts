import * as VueRouter from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import HelloWorldBis from "../components/HelloWorldBis.vue";

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/register", component: HelloWorld },
  { path: "/owner", component: HelloWorldBis },
  { path: "/property", component: HelloWorldBis },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});

export default router;
