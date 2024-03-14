import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: (routes) => setupLayouts(routes),
});

router.afterEach((guard) => {
  window.onbeforeunload = null;
  const authStore = useAuthStore();
  const isLogin = authStore.isLogin;
  if (guard.meta.requireAuth && !isLogin) {
    router.push("/login");
  }
  if (guard.meta.requireAuth && guard.path == "/login" && isLogin) {
    router.push("/");
  }
});

export default router;
