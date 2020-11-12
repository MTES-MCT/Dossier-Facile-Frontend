import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import LoginPage from "@/views/LoginPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "DossierFacile"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Connexion - DossierFacile"
    }
  },
  {
    path: "/signup",
    name: "Signup",
    meta: {
      title: "Création compte - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "signup" */ "@/views/SignupPage.vue")
  },
  {
    path: "/join-roommate",
    name: "JoinRommate",
    meta: {
      title: "Rejoindre un colocataire - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/JoinRoommate.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      title: "Édition du profile - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/Profile.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    document.getElementById("app")?.scrollIntoView();
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
