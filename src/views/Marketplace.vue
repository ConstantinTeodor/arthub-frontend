<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <NewsList/>
      <ArtworkList/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import NewsList from "@/components/NewsList.vue";
import ArtworkList from "@/components/ArtworkList.vue";
export default {
  name: "MarketPlace",
  components: {
    TopNavigationBar,
    NewsList,
    ArtworkList,
  },
}
</script>

<style scoped>

</style>