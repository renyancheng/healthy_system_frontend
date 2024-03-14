<script setup></script>

<template>
  <v-app>
    <v-main>
      <v-row class="h-screen" justify="center" align="center">
        <v-col xs="12" sm="8" md="6" lg="4">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style scoped></style>
