import Vue from "vue";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);

const DOMAIN = `${process.env.VUE_APP_DOMAIN}`;

export const CookiesService = {
  setCookie(name: string, value: string, expires?: string | Date) {
    Vue.$cookies.set(name, value, expires, "", DOMAIN);
  },
  getCookie(name: string) {
    return Vue.$cookies.get(name);
  },
  isTrue(cookieName: string) {
    return this.getCookie(cookieName) === "true";
  },
  datePlusDaysFromNow(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  },
};
