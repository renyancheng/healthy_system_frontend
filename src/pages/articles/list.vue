<script setup>
import { useRequest } from "vue-hooks-plus";
import router from "@/router";
import { useGoTo } from "vuetify";
import { getArticleList } from "@/api";

const goTo = useGoTo();

const page = ref(1);
const pageSize = ref(10);

const { data, loading, error } = useRequest(() => getArticleList(page.value), {
  refreshDeps: [page, pageSize],
});
</script>

<template>
  <div>
    <div>
      <template v-if="loading">
        <div>
          <div class="text-h5 mb-5">饮食日记</div>
          <v-row>
            <v-col cols="12" sm="6" md="4" v-for="(k, v) in 5" :key="k">
              <v-skeleton-loader type="card" elevation="1"></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-else-if="data.data.list.length == 0">
        <div>
          <v-empty-state
            icon="mdi-magnify"
            title="没有人发表文章"
          ></v-empty-state>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="text-h5 mb-5">最新文章</div>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="article in data.data.list"
              :key="article.id"
            >
              <v-card :to="'/articles/' + article.id">
                <v-img
                  :src="'https://picsum.photos/400/400?random=1&' + article.id"
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200"
                  weight="200"
                  cover
                >
                  <v-card-title class="text-white">
                    {{ article.title }}
                  </v-card-title>
                </v-img>
                <v-card-actions>
                  <v-list-item class="w-100">
                    <template v-slot:prepend>
                      <v-avatar
                        color="grey-darken-3"
                        :image="article.user.avatar"
                      ></v-avatar>
                    </template>

                    <v-list-item-title
                      v-text="article.user.nickname"
                    ></v-list-item-title>

                    <v-list-item-subtitle
                      v-text="
                        $dayjs
                          .unix(article.created_time)
                          .format('YYYY-MM-DD HH:mm:ss')
                      "
                    ></v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="justify-self-end">
                        <v-icon class="me-1" icon="mdi-eye-outline"></v-icon>
                        <span class="subheading me-2">{{
                          article.views < 999 ? article.views : "999+"
                        }}</span>
                        <!-- <span class="me-1">·</span>
                        <v-icon
                          class="me-1"
                          icon="mdi-share-variant-outline"
                        ></v-icon> -->
                        <!-- <span class="subheading">45</span> -->
                      </div>
                    </template>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-pagination
            class="my-5"
            v-model="page"
            :length="data?.data?.totalPage ? data.data.totalPage : 1"
            @update:model-value="() => goTo(0)"
            color="primary"
          ></v-pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
