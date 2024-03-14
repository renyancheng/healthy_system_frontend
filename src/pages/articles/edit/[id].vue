<script setup>
import { useRequest } from "vue-hooks-plus";
import { notifySuccess } from "vuetify3-dialog";
import { getArticle, updateArticle } from "@/api";
import router from "@/router";
import { useAuthStore } from "@/store/auth";

const { params } = useRoute();
const authStore = useAuthStore();
const hasRole = ref(true);

const { id } = params;
const articleId = ref(id);

const { data, loading } = useRequest(() => getArticle(articleId.value), {
  refreshDeps: [articleId],
});

const {
  data: updateResult,
  loading: loadingUpdate,
  runAsync,
} = useRequest(updateArticle, {
  manual: true,
});

const title = ref("");
const content = ref("");

watch(data, (newData) => {
  if (newData.data) {
    if (newData.data.user.id !== authStore.user.id) {
      hasRole.value = false;
    }
    title.value = newData.data.title;
    content.value = newData.data.content;
  }
});

const onSubmit = async () => {
  await runAsync({
    id: articleId.value,
    title: title.value,
    content: content.value,
  });
  if (updateResult.value.code === 200) {
    notifySuccess("文章修改成功", {
      location: "bottom center",
    });
    router.push(`/articles/${articleId.value}`);
  }
};
window.onbeforeunload = () => {
  return "close?";
};
</script>

<template>
  <div>
    <template v-if="loading">
      <div>
        <v-skeleton-loader
          type="subtitle,card,article"
          class="mb-5"
          max-width="800"
        />
      </div>
    </template>
    <template v-else-if="!loading && data.code != 200">
      <div>
        <v-empty-state
          icon="mdi-alert-circle-outline"
          title="没有找到此文章"
        ></v-empty-state>
      </div>
    </template>
    <template v-else-if="!hasRole">
      <div>
        <v-empty-state
          icon="mdi-alert-circle-outline"
          title="没用权限编辑此文章"
        ></v-empty-state>
      </div>
    </template>
    <template v-else>
      <div>
        <form @submit.prevent="onSubmit">
          <div class="text-h5 mb-5">编辑文章</div>
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
          <v-layout-item
            class="text-end"
            position="bottom"
            size="80"
            model-value
          >
            <v-btn
              class="ma-4"
              color="primary"
              elevation="8"
              size="large"
              icon="mdi-content-save"
              :loading="loading"
              type="submit"
            ></v-btn>
          </v-layout-item>
        </form>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
