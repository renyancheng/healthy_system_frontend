<script setup>
import { useRequest } from "vue-hooks-plus";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { notifyWarning, notifySuccess } from "vuetify3-dialog";
import dayjs from "@/plugins/day";
import { getUserInfo, updateUserInfo } from "@/api";

const { data, loading, error } = useRequest(getUserInfo);
const {
  data: updateResult,
  loading: loadingUpdate,
  runAsync: runUpdateUserInfo,
} = useRequest(updateUserInfo, {
  manual: true,
});

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    birth_date: yup
      .string()
      .matches(
        /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/,
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
    health_conditions: yup.string().notRequired(),
  }),
});

const birth_date = useField("birth_date");
const gender = useField("gender");
const height = useField("height");
const weight = useField("weight");
const health_conditions = useField("health_conditions");

watch(data, (newData) => {
  if (newData) {
    newData = newData.data;
    birth_date.value.value = dayjs
      .unix(newData.birth_date)
      .format("YYYY-MM-DD HH:MM:ss");
    gender.value.value = newData.gender;
    height.value.value = newData.height;
    weight.value.value = newData.weight;
    health_conditions.value.value = newData.health_conditions;
  }
});

const onSubmit = handleSubmit(async (values) => {
  if (!loading.value) {
    await runUpdateUserInfo(values);
    if (!loadingUpdate.value && updateResult.value.code === 200) {
      notifySuccess("修改成功", {
        location: "bottom center",
      });
    }
  }
});
</script>

<template>
  <div>
    <template v-if="loading">
      <div>
        <v-skeleton-loader
          class="mx-auto border"
          type="image, text, text, text,text"
        ></v-skeleton-loader>
      </div>
    </template>
    <template v-else>
      <div>
        <v-card>
          <v-img
            height="30vh"
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            cover
          ></v-img>

          <v-card-item>
            <div class="text-center text-h5">个人信息</div>
          </v-card-item>

          <v-card-text>
            <form @submit.prevent="onSubmit">
              <v-select
                v-model="gender.value.value"
                :error-messages="gender.errorMessage.value"
                variant="outlined"
                :items="['男', '女', '其他']"
                label="性别"
                name="gender"
              ></v-select>

              <v-text-field
                class="my-3"
                v-model="height.value.value"
                :error-messages="height.errorMessage.value"
                label="身高"
                variant="outlined"
                type="text"
                name="height"
              ></v-text-field>
              <v-text-field
                class="my-3"
                v-model="weight.value.value"
                :error-messages="weight.errorMessage.value"
                label="体重"
                variant="outlined"
                type="text"
                name="weight"
              ></v-text-field>
              <v-text-field
                class="my-3"
                v-model="birth_date.value.value"
                :error-messages="birth_date.errorMessage.value"
                label="出生日期"
                variant="outlined"
                type="text"
                name="birth_date"
              ></v-text-field>
              <v-textarea
                class="my-3"
                v-model="health_conditions.value.value"
                :error-messages="health_conditions.errorMessage.value"
                label="健康状况"
                variant="outlined"
                name="health_conditions"
              ></v-textarea>
              <div class="text-right">
                <v-btn color="primary" type="submit" :loading="loadingUpdate"
                  >修改并保存</v-btn
                >
              </div>
            </form>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
