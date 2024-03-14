<script setup>
import { useAuthStore } from "@/store/auth";
import { useRouter, useRoute } from "vue-router";
import { logout } from "@/api";
import { createNotification } from "vuetify3-dialog";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const handleLogout = async () => {
  try {
    const res = await logout();
    if (res.code === 200) {
      createNotification({
        text: "退出登录成功",
        level: "success",
        location: "bottom center",
      });
      authStore.logout();
      router.push("/login");
    }
  } catch (error) {
    console.error(error);
  }
};
const { user } = authStore;
const drawer = ref(false);
const open = ref([]);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const items = [
  { text: "首页", icon: "mdi-home-outline", hasSubItems: false, to: "/" },
  {
    text: "个人信息",
    icon: "mdi-account-outline",
    hasSubItems: false,
    to: "/user/info",
  },
  {
    text: "饮食日记",
    icon: "mdi-file-document-edit-outline",
    hasSubItems: true,
    subItems: [
      { text: "写日记", to: "/diet-diarys/new" },
      { text: "回顾日记", to: "/diet-diarys/list" },
    ],
    to: "/diet-diarys/",
  },
  {
    text: "文章",
    icon: "mdi-text-box-multiple-outline",
    hasSubItems: true,
    subItems: [
      { text: "写文章", to: "/articles/new" },
      { text: "看看文章", to: "/articles/list" },
    ],
    to: "/articles/",
  },
];
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-item
            :prepend-avatar="user.avatar"
            :subtitle="user.username"
            :title="user.nickname"
          >
            <template v-slot:append>
              <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list :lines="false" v-model:opened="open" nav>
          <template v-for="(item, i) in items" :key="i">
            <div>
              <v-list-item
                v-if="!item.hasSubItems"
                color="primary"
                rounded="xl"
                :value="item"
                :to="item.to"
                exact
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item>
              <v-list-group v-else :value="item.text">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    color="primary"
                    rounded="xl"
                    v-bind="props"
                    :prepend-icon="item.icon"
                    :title="item.text"
                  ></v-list-item>
                </template>
                <v-list-item
                  v-for="(subItem, j) in item.subItems"
                  :key="j"
                  color="primary"
                  rounded="xl"
                  :title="subItem.text"
                  :value="subItem"
                  :to="subItem.to"
                  exact
                ></v-list-item>
              </v-list-group>
            </div>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="primary">
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

        <v-app-bar-title>健康饮食管理系统</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-dots-vertical" id="appbar-menu"> </v-btn>
        <v-menu activator="#appbar-menu">
          <v-list>
            <v-list-item @click="handleLogout">
              <template v-slot:prepend>
                <v-icon icon="mdi-logout"></v-icon>
              </template>
              <v-list-item-title> 退出登录 </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
