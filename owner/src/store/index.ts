import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state: any) {
      state.count++;
    },
  },
  getters: {
    count(state: any) {
      return state.count;
    },
  },
});

export default store;
