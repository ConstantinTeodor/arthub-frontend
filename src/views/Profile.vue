<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <ProfileComponent :id="parseInt(clientId)"/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import ProfileComponent from "@/components/ProfileComponent.vue";
import { useRouter } from "vue-router";

export default {
  name: "ProfilePage",
  components: {
    ProfileComponent,
    TopNavigationBar,
  },
  setup() {
    const router = useRouter();

    const clientId = router.currentRoute.value.params.id;

    return {
      clientId
    };
  }
}
</script>

<style scoped>

</style>