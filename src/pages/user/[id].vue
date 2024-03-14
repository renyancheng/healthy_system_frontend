<script setup>
import { useRoute } from "vue-router/auto";
const {
  params: { id },
} = useRoute();
</script>

<template>
  <div>user: {{ id }}</div>
</template>

<style scoped></style>
