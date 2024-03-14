<script setup>
import { useForm, useField } from "vee-validate";
import { useRequest } from "vue-hooks-plus";
import * as yup from "yup";
import { notifySuccess } from "vuetify3-dialog";
import { login } from "@/api";
import { useAuthStore } from "@/store/auth";
import router from "@/router";

const authStore = useAuthStore();

const { handleSubmit } = useForm({
  initialValues: {
    name: "",
    password: "",
  },
  validationSchema: yup.object({
    username: yup
      .string()
      .required("用户名是必填项")
      .matches(
        /^[\w-]{4,16}$/,
        "用户名应为4到16位(仅可包含字母，数字，下划线，减号）"
      ),
    password: yup
      .string()
      .required("密码是必填项")
      .matches(
        /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
        "密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"
      ),
  }),
});
const username = useField("username");
const password = useField("password");
const { data, loading, runAsync } = useRequest(login, {
  manual: true,
});
const onSubmit = handleSubmit(async ({ username, password }) => {
  // 请求登录接口，获取用户数据，然后存储token到store，最后跳转到首页
  // 拿到请求数据
  await runAsync(username, password);
  if (data.value.code === 200) {
    authStore.login(data.value.data);
    notifySuccess("登录成功", { location: "bottom center" });
    router.push("/");
  }
});
</script>

<template>
  <div>
    <v-sheet elevation="2" class="pa-5" max-width="500">
      <div class="text-center">
        <div class="text-h3 my-5">
          <v-icon color="primary">mdi-login</v-icon>
        </div>
        <div class="text-h4 mb-1">登录</div>
        <div class="text-body-1 text-medium-emphasis mb-1">
          正在登录健康饮食推荐系统
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="my-5">
        <v-text-field
          class="mb-5"
          v-model="username.value.value"
          :error-messages="username.errorMessage.value"
          label="用户名"
          variant="outlined"
          type="text"
          name="username"
          autofocus
        ></v-text-field>
        <v-text-field
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          label="密码"
          variant="outlined"
          type="password"
          name="password"
        ></v-text-field>

        <v-btn
          class="my-5"
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          登录
        </v-btn>
        <div class="text-center mt-5">
          <router-link class="text-primary text-decoration-none" to="/register">
            现在注册！ <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </div>
      </form>
    </v-sheet>
  </div>
</template>

<style scoped></style>
<route lang="yaml">
meta:
  layout: login-layout
  requireAuth: false
</route>
