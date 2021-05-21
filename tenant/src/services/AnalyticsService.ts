/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";

export const AnaliticsService = {
  sendEvent(name: string, data: unknown) {
    if (Vue.$cookies.get("accept-cookie") === "true") {
      Vue.prototype.$gtag.event(name, data);
    }
  },

  loginSuccess() {
    this.sendEvent("login success", { event_category: "login" });
  },

  loginFail() {
    this.sendEvent("login fail", { event_category: "login" });
  },

  registerSuccess() {
    this.sendEvent("register success", { event_category: "login" });
  },

  registerFail() {
    this.sendEvent("register fail", { event_category: "login" });
  },

  openHelp(id: string) {
    this.sendEvent("open help " + id, { event_category: "help" });
  },

  viewFromMenu(docType: string) {
    this.sendEvent("view menu " + docType, { event_category: "funnel" });
  },

  viewFromMain(docType: string) {
    this.sendEvent("view main " + docType, { event_category: "funnel" });
  },

  deleteFile(docType: string) {
    this.sendEvent("delete file " + docType, { event_category: "funnel" });
  },

  confirmName(status: string) {
    this.sendEvent("valid name " + status, { event_category: "funnel" });
  },

  confirmType(status: string) {
    this.sendEvent("valid name " + status, { event_category: "funnel" });
  },

  uploadFile(docType: string) {
    this.sendEvent("upload file " + docType, { event_category: "funnel" });
  },

  registerFile(docType: string) {
    this.sendEvent("upload file " + docType, { event_category: "funnel" });
  },

  validateFunnel(docType: string) {
    this.sendEvent("upload file " + docType, { event_category: "funnel" });
  },

  addGuarantor(guarantorType: string) {
    this.sendEvent("add guarantor " + guarantorType, {
      event_category: "funnel"
    });
  },

  validateFile() {
    this.sendEvent("validate file", { event_category: "file" });
  }
};
