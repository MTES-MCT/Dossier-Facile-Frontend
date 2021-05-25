/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";
import store from "../store";

export const AnalyticsService = {
  sendEvent(name: string, data: any) {
    if (Vue.$cookies.get("accept-cookie") === "true") {
      if (store.state.user?.id !== undefined) {
        data.event_value = store.state.user.id;
      }
      Vue.prototype.$gtag.event(name, data);
    }
  },

  loginSuccess() {
    this.sendEvent("login success", {
      event_category: "login",
      event_label: "login success"
    });
  },

  loginFail() {
    this.sendEvent("login fail", {
      event_category: "login",
      event_label: "login fail"
    });
  },

  registerSuccess() {
    this.sendEvent("register success", {
      event_category: "login",
      event_label: "register success"
    });
  },

  registerFail() {
    this.sendEvent("register fail", {
      event_category: "login",
      event_label: "register fail"
    });
  },

  openHelp(docType: string) {
    this.sendEvent("open", {
      event_category: "help",
      event_label: docType
    });
  },

  editFromMenu(docType: number) {
    this.sendEvent("menu-edit-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  viewFromMenu(docType: string) {
    this.sendEvent("menu-view-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  viewFromMain() {
    this.sendEvent("main-view-doc", {
      event_category: "funnel"
    });
  },

  editFromAccount(docType: number) {
    this.sendEvent("account-edit-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  viewFromAccount(docType: string) {
    this.sendEvent("account-view-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  editFromMessage(docType: number) {
    this.sendEvent("message-edit-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  viewFromMessage(docType: string) {
    this.sendEvent("message-view-doc", {
      event_category: "funnel",
      event_label: docType
    });
  },

  deleteFile(docType: string) {
    this.sendEvent("file-delete", {
      event_category: "funnel",
      event_label: docType
    });
  },

  deleteAccount() {
    this.sendEvent("account-delete", {
      event_category: "account"
    });
  },

  copyLink(full: string) {
    this.sendEvent("copy-link", {
      event_category: "account",
      event_label: full
    });
  },

  confirmName() {
    this.sendEvent("confirm-name", { event_category: "funnel" });
  },

  confirmType() {
    this.sendEvent("confirm-type", { event_category: "funnel" });
  },

  uploadFile(docType: string) {
    this.sendEvent("upload-file", {
      event_category: "funnel",
      event_label: docType
    });
  },

  registerFile(docType: string) {
    this.sendEvent("register-file", {
      event_category: "funnel",
      event_label: docType
    });
  },

  validateFunnel() {
    this.sendEvent("validate-tenant-funnel", { event_category: "funnel" });
  },

  addGuarantor(guarantorType: string) {
    this.sendEvent("add-guarantor", {
      event_category: "funnel",
      event_label: guarantorType
    });
  },

  validateFile() {
    this.sendEvent("validate file", { event_category: "file" });
  }
};
