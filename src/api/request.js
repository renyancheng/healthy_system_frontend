import axios from "axios";
import router from "@/router";
import { createNotification } from "vuetify3-dialog";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const service = axios.create({
  // baseURL: "http://dev.com",
  baseURL: "/api",
  // withCredentials: true,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (authStore.token && authStore.token !== "") {
      config.headers["Authorization"] = authStore.token;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code && res.code !== 200) {
      createNotification({
        text: res.msg || "未知错误",
        level: "error",
        location: "bottom center",
        notifyOptions: {},
      });
    }
    if (res.code && res.code === 1000) {
      // 登录超时,重新登录
      authStore.logout();
      router.push("/login");
    }
    return Promise.resolve(res);
  },
  (error) => {
    console.log("request err" + error);
    return Promise.reject(error);
  }
);
export default service;
