<script setup>
import { useRequest } from "vue-hooks-plus";
import dom2image from "dom-to-image";
import { getDietDiary } from "@/api";

const { params } = useRoute();
const { id } = params;
const diaryId = ref(id);
const { data, loading, error } = useRequest(() => getDietDiary(diaryId.value), {
  refreshDeps: [diaryId],
});

const node = ref(null);

const loadingShare = ref(false);

const handleShare = () => {
  const node = document.getElementById("shareContent"); // 通过id获取dom
  // 删除不需要的dom
  const actions = document.getElementById("actions");
  actions.style.display = "none";
  loadingShare.value = true;
  dom2image
    .toPng(node)
    .then((dataUrl) => {
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = new Date().getTime() + ".png";
      a.href = dataUrl;
      a.dispatchEvent(event);
      actions.style.display = "flex";
      loadingShare.value = false;
    })
    .catch(function (error) {
      console.error(error);
      actions.style.display = "flex";
      loadingShare.value = false;
    });
};
</script>

<template>
  <div>
    <v-overlay v-model="loadingShare" class="align-center justify-center" persistent>
      <div class="text-center">
        <v-list class="py-2" color="primary" elevation="12" rounded="lg">
          <v-list-item prepend-icon="mdi-download-outline" title="正在生成图片">
            <template v-slot:prepend>
              <div class="pe-4">
                <v-icon color="primary" size="x-large"></v-icon>
              </div>
            </template>

            <template v-slot:append>
              <v-progress-circular
                class="ml-4"
                color="primary"
                indeterminate="disable-shrink"
                size="16"
                width="2"
              ></v-progress-circular>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-overlay>
    <template v-if="loading">
      <div>
        <v-skeleton-loader type="card" class="mx-auto" max-width="800" />
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
      <div id="shareContent">
        <v-card class="mx-auto" max-width="800">
          <v-img
            :src="'https://picsum.photos/400/400?random=1&' + data.data.id"
            class="align-end text-white"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200"
            weight="200"
            cover
          >
            <v-card-title>{{
              $dayjs.unix(data.data.created_time).format("YYYY-MM-DD dddd A")
            }}</v-card-title>
          </v-img>

          <div class="px-4 my-8">
            <render :md="data.data.meals"></render>
          </div>
          <v-divider></v-divider>
          <v-card-actions id="actions">
            <v-spacer></v-spacer>
            <v-btn
              :to="`/diet-diarys/edit/${data.data.id}`"
              icon
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn @click="handleShare" icon>
              <v-icon>mdi-share-variant-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
