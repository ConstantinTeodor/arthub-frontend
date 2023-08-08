<template>
  <v-app>
    <TopNavigationBar/>
    <v-main :style="{ marginLeft: '300px', marginRight: '300px', marginTop: '100px' }">
      <AddPostForm/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import AddPostForm from "@/components/AddPostForm.vue";

export default {
  name: "AddPost",
  components: {
    TopNavigationBar,
    AddPostForm
  },
}
</script>

<style scoped>

</style>