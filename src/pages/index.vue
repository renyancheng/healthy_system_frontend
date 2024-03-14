<script setup>
import { useRequest } from "vue-hooks-plus";
import { getUserInfo } from "@/api";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const { data, loading, runAsync } = useRequest(getUserInfo);

</script>
<template>
  <div>home view</div>
</template>

<style scoped></style>

<route lang="yaml">
meta:
  layout: default
  requireAuth: true
</route>
