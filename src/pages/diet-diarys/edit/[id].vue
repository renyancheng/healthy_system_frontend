<script setup>
import { useRequest } from "vue-hooks-plus";
import { notifySuccess } from "vuetify3-dialog";
import { getDietDiary, updateDietDiary } from "@/api";
import router from "@/router";

const { params } = useRoute();
const { id } = params;
const diaryId = ref(id);
const { data, loading } = useRequest(() => getDietDiary(diaryId.value), {
  refreshDeps: [diaryId],
});

const {
  data: updateResult,
  loading: loadingUpdate,
  runAsync,
} = useRequest((id, meals) => updateDietDiary(id, meals), {
  manual: true,
});

const meals = ref("");

watch(data, (newData) => {
  if (newData.data) {
    meals.value = newData.data.meals;
  }
});

const onSubmit = async () => {
  await runAsync(id, meals.value);
  if (updateResult.value.code === 200) {
    notifySuccess("日记修改成功", {
      location: "bottom center",
    });
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
        <v-skeleton-loader type="subtitle,card,article" class="mb-5" max-width="800" />
      </div>
    </template>
    <template v-else-if="!loading && data.code != 200">
      <div>
        <v-empty-state
          icon="mdi-alert-circle-outline"
          title="没有找到此日记"
          text="请确认日记是否存在或者联系管理员"
        ></v-empty-state>
      </div>
    </template>
    <template v-else>
      <div>
        <form @submit.prevent="onSubmit">
          <div class="text-h5 mb-5">
            编辑日记：
            {{
              $dayjs.unix(data.data.created_time).format("YYYY-MM-DD dddd A")
            }}
          </div>
          <v-sheet elevation="1">
            <editor v-model="meals"></editor>
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
              :loading="loadingUpdate"
              type="submit"
            ></v-btn>
          </v-layout-item>
        </form>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
