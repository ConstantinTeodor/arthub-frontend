<template>
  <v-app>
    <TopNavigationBar/>
    <router-view/>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
export default {
  name: 'App',
  components: {
    TopNavigationBar,
  },
}
</script>

