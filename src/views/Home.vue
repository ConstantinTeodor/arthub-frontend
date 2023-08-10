<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <PostCard/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import PostCard from "@/components/PostCard.vue";

export default {
  name: "HomePage",
  components: {
    TopNavigationBar,
    PostCard,
  },
}
</script>

<style scoped>

</style>