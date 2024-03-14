<script setup>
import { useRequest } from "vue-hooks-plus";
import { notifySuccess } from "vuetify3-dialog";
import { createArticle } from "@/api";
import router from "@/router";

const { data, loading, error, runAsync } = useRequest(createArticle, {
  manual: true,
});

const title = ref("");
const content = ref("");
const onSubmit = async () => {
  await runAsync({ title: title.value, content: content.value });
  if (data.value.code === 200) {
    notifySuccess("文章创建成功", {
      location: "bottom center",
    });
    router.push("/articles/list");
  }
};
window.onbeforeunload = () => {
  return "close?";
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="text-h5 mb-5">写文章</div>
      <v-sheet elevation="1">
        <v-text-field
          class="mb-5"
          v-model="title"
          label="标题"
          outlined
          dense
          clearable
          autofocus
          required
        />
        <editor v-model="content"></editor>
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
