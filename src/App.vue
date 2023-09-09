<template>
  <v-app>
    <TopNavigationBar/>
    <router-view/>
    <FooterComponent/>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import FooterComponent from "@/components/FooterComponent.vue";
export default {
  name: 'App',
  components: {
    TopNavigationBar,
    FooterComponent
  },
}
</script>

