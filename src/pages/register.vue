<script setup>
import { useForm, useField, useIsFormValid } from "vee-validate";
import { useRequest } from "vue-hooks-plus";
import * as yup from "yup";
import { notifySuccess } from "vuetify3-dialog";
import { register } from "@/api";
import { useAuthStore } from "@/store/auth";
import router from "@/router";

const authStore = useAuthStore();

const currentStep = ref(1);

const schemas = [
  yup.object({
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
  yup.object({
    nickname: yup
      .string()
      .required("昵称是必填项")
      .min(2, "昵称最少2位")
      .max(16, "昵称最多16位"),
    email: yup.string().email("邮箱格式不正确").required("邮箱是必填项"),
    phone_number: yup
      .string()
      .required("手机号是必填项")
      .matches(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/, "手机号格式不正确"),
    birth_date: yup
      .string()
      .matches(
        /^\d{4}([/:-\S])(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        "日期格式不正确(YYYY-MM-DD HH:MM:ss)"
      )
      .required("出生日期是必填项"),
    gender: yup.string().required("性别是必填项"),
    height: yup
      .number()
      .required("身高是必填项")
      .min(100, "身高最小100cm")
      .max(300, "身高最大300cm"),
    weight: yup
      .number()
      .required("体重是必填项")
      .min(20, "体重最小20kg")
      .max(300, "体重最大300kg"),
    health_conditions: yup.string(),
  }),
];
const currentSchema = computed(() => {
  return schemas[currentStep.value - 1];
});

const { data, runAsync, loading } = useRequest(register, {
  manual: true,
});

const { handleSubmit } = useForm({
  /* initialValues: {
    username: "",
    password: "",
    nickname: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    height: "",
    weight: "",
    health_conditions: "",
  }, */
  validationSchema: currentSchema,
});

const isValid = useIsFormValid();

const nextStep = () => {
  if (currentStep.value === 2) return;
  currentStep.value++;
};

function prevStep() {
  if (currentStep.value === 1) return;
  currentStep.value--;
}

const username = useField("username");
const password = useField("password");
const nickname = useField("nickname");
const email = useField("email");
const phone_number = useField("phone_number");
const birth_date = useField("birth_date");
const gender = useField("gender");
const height = useField("height");
const weight = useField("weight");
const health_conditions = useField("health_conditions");

const allIsValid = computed(() => {
  return currentStep.value === 2 && isValid.value;
});

const onSubmit = handleSubmit((values) => {
  runAsync(values).then((res) => {
    if (res.code === 200) {
      notifySuccess("注册成功，请登录",{
        location: "bottom center",
      });
      router.push("/login");
    }
  });
});
</script>

<template>
  <div>
    <v-sheet elevation="2" class="pa-5" max-width="500">
      <div class="text-center">
        <div class="text-h3 my-5">
          <v-icon color="primary">mdi-account-plus</v-icon>
        </div>
        <div class="text-h4 mb-1">注册</div>
        <div class="text-body-1 text-medium-emphasis mb-1">注册你的新用户</div>
      </div>

      <form @submit.prevent="onSubmit" class="my-5">
        <v-stepper
          class="my-5"
          color="primary"
          v-model="currentStep"
          :items="['填写基本信息', '填写个人信息']"
          next-text="下一步"
          prev-text="上一步"
        >
          <template v-slot:item.1>
            <v-text-field
              class="my-3"
              v-model="username.value.value"
              :error-messages="username.errorMessage.value"
              label="用户名 *"
              variant="outlined"
              type="text"
              name="username"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
              label="密码 *"
              variant="outlined"
              type="password"
              name="password"
            ></v-text-field>
          </template>

          <template v-slot:item.2>
            <v-text-field
              class="my-3"
              v-model="nickname.value.value"
              :error-messages="nickname.errorMessage.value"
              label="昵称 *"
              variant="outlined"
              type="nickname"
              name="nickname"
              autofocus
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              label="邮箱 *"
              variant="outlined"
              type="email"
              name="email"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="phone_number.value.value"
              :error-messages="phone_number.errorMessage.value"
              label="手机号 *"
              variant="outlined"
              type="phone"
              name="phone_number"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="birth_date.value.value"
              :error-messages="birth_date.errorMessage.value"
              label="出生日期 * "
              variant="outlined"
              type="text"
              name="birth_date"
            >
              <!-- <v-menu activator="parent" :close-on-content-click="false">
                <v-date-picker
                  transition="slide-y-transition"
                  v-model="birth_date.value.value"
                  color="primary"
                ></v-date-picker> </v-menu
            > -->
            </v-text-field>
            <v-select
              v-model="gender.value.value"
              :error-messages="gender.errorMessage.value"
              variant="outlined"
              :items="['男', '女', '其他']"
              label="性别 *"
              name="gender"
            ></v-select>
            <v-text-field
              class="my-3"
              v-model="height.value.value"
              :error-messages="height.errorMessage.value"
              label="身高 *"
              variant="outlined"
              type="text"
              name="height"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="weight.value.value"
              :error-messages="weight.errorMessage.value"
              label="体重 *"
              variant="outlined"
              type="text"
              name="weight"
            ></v-text-field>
            <v-textarea
              class="my-3"
              v-model="health_conditions.value.value"
              :error-messages="health_conditions.errorMessage.value"
              label="健康状况"
              variant="outlined"
              name="health_conditions"
            ></v-textarea>
          </template>
          <template #prev>
            <v-btn
              @click="prevStep"
              color="primary"
              text
              :disabled="currentStep <= 1"
              >上一步
            </v-btn>
          </template>
          <template #next @click="nextStep">
            <v-btn
              @click="nextStep"
              color="primary"
              text
              :disabled="currentStep >= 2 || !isValid"
            >
              下一步
            </v-btn>
          </template>
        </v-stepper>
        <v-btn
          class="my-5"
          type="submit"
          color="primary"
          block
          :loading="loading"
          :disabled="!allIsValid"
        >
          注册
        </v-btn>
        <div class="text-center mt-5">
          <router-link class="text-primary text-decoration-none" to="/login">
            已有账户？去登陆 <v-icon icon="mdi-chevron-right"></v-icon>
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
