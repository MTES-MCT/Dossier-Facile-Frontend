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
  setJsonCookie(name: string, value: any, expires?: string | Date) {
    const json = JSON.stringify(value);
    const base64 = btoa(json);
    Vue.$cookies.set(name, base64, expires, "", DOMAIN);
  },
  getJsonCookie(name: string) {
    const base64 = Vue.$cookies.get(name);
    if (base64 != undefined) {
      const json = atob(base64);
      return JSON.parse(json);
    }
  },
  isTrue(cookieName: string) {
    return this.getCookie(cookieName) === "true";
  },
  deleteCookie(name: string) {
    Vue.$cookies.remove(name);
  },
  datePlusDaysFromNow(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  },
};
