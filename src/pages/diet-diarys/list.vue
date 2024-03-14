<script setup>
import { useRequest } from "vue-hooks-plus";
import router from "@/router";
import { useGoTo } from "vuetify";
import { getDietDiaryList } from "@/api";

const goTo = useGoTo();

const page = ref(1);
const pageSize = ref(10);

const { data, loading, error } = useRequest(
  () => getDietDiaryList(page.value, pageSize.value),
  {
    refreshDeps: [page, pageSize],
  }
);
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
            title="没有饮食日记"
            text="快先写一个去吧"
          ></v-empty-state>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="text-h5 mb-5">饮食日记</div>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="dietDiary in data.data.list"
              :key="dietDiary.id"
            >
              <v-card :to="'/diet-diarys/' + dietDiary.id">
                <v-img
                  :src="
                    'https://picsum.photos/400/400?random=1&' + dietDiary.id
                  "
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200"
                  weight="200"
                  cover
                >
                  <v-card-title
                    class="text-white"
                    v-text="
                      $dayjs
                        .unix(dietDiary.created_time)
                        .format('YYYY-MM-DD dddd A')
                    "
                  ></v-card-title>
                </v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :ripple="false" icon>
                    <v-icon>mdi-thumb-up-outline</v-icon>
                  </v-btn>
                  <v-btn :ripple="false" icon>
                    <v-icon>mdi-star-outline</v-icon>
                  </v-btn>
                  <v-btn :ripple="false" icon>
                    <v-icon>mdi-share-variant-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
              <!-- <v-card color="" :to="'/diet-diarys/' + dietDiary.id">
                <v-img
                  :src="
                    'https://picsum.photos/400/400?random=1&' + dietDiary.id
                  "
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200"
                  weight="200"
                  cover
                ></v-img>
                <v-card-item>
                  <div>
                    <div class="text-h6 mb-1">
                      {{
                        $dayjs
                          .unix(dietDiary.created_time)
                          .format("YYYY-MM-DD dddd A")
                      }}
                    </div>
                    <div class="text-caption">
                      
                    </div>
                  </div>
                </v-card-item>
              </v-card> -->
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
