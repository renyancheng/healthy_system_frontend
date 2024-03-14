<script setup>
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { uploadImage } from "@/api";

const text = defineModel();

const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);

        uploadImage(form)
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  // 方式一
  callback(res.map((item) => item.data));

  // 方式二
  // callback(
  //   res.map((item: any) => ({
  //     url: item.data.url,
  //     alt: 'alt',
  //     title: 'title'
  //   }))
  // );
};
</script>

<template>
  <div>
    <MdEditor v-model="text" @onUploadImg="onUploadImg" />
  </div>
</template>

<style scoped></style>
