<template>
  <v-app class="background">
    <TopNavigationBar/>
    <v-main>
      <PasswordRecoveryForm/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import PasswordRecoveryForm from "@/components/PasswordRecoveryForm.vue";
export default {
  name: "PasswordRecovery",
  components: {
    TopNavigationBar,
    PasswordRecoveryForm
  },
}
</script>

<style scoped>
.background {
  background-image: url('../assets/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
}
</style>