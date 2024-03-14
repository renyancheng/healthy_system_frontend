<script setup>
import { useRequest } from "vue-hooks-plus";
import { notifySuccess } from "vuetify3-dialog";
import { createDietDiary } from "@/api";
import router from "@/router";

const { data, loading, error, runAsync } = useRequest(createDietDiary, {
  manual: true,
});

const meals = ref(`# 今天的饮食

## 早餐

## 午餐

## 晚餐

# 今天的感受

# 今天的运动

# 今天的体重

# 今天的心情

# 今天的睡眠

`);
const onSubmit = async () => {
  await runAsync(meals.value);
  if (data.value.code === 200) {
    notifySuccess("日记创建成功", {
      location: "bottom center",
    });
    router.push("/diet-diarys/list");
  }
};

window.onbeforeunload = () => {
  return "close?";
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="text-h5 mb-5">写日记</div>
      <v-sheet elevation="1">
        <editor v-model="meals"></editor>
      </v-sheet>
      <v-layout-item class="text-end" position="bottom" size="80" model-value>
        <v-btn
          class="ma-4"
          color="primary"
          elevation="8"
          size="large"
          icon="mdi-plus"
          :loading="loading"
          type="submit"
        ></v-btn>
      </v-layout-item>
    </form>
  </div>
</template>

<style scoped></style>
