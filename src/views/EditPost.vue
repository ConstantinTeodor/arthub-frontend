<template>
  <v-app>
    <TopNavigationBar/>
    <v-main :style="{ marginLeft: '300px', marginRight: '300px', marginTop: '100px' }">
      <EditPostForm :postId="postId" />
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import EditPostForm from "@/components/EditPostForm.vue";
import { useRouter } from "vue-router";

export default {
  name: "EditPost",
  components: {
    TopNavigationBar,
    EditPostForm
  },
  setup() {
    const router = useRouter();

    const postId = router.currentRoute.value.params.id;

    return {
      postId
    };
  }
}
</script>

<style scoped>

</style>