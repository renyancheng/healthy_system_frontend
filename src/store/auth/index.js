import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    login(user) {
      this.token = user.token;
      this.user = user;
    },
    logout() {
      this.token = null;
      this.user = null;
    }
  },
  getters: {
    isLogin: (state) => !!state.token,
  },
  persist: true,
});
