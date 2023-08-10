<template>
  <v-app class="background">
    <TopNavigationBar/>
    <v-main>
      <RegisterForm/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import RegisterForm from "@/components/RegisterForm.vue";
export default {
  name: "RegisterPage",
  components: {
    TopNavigationBar,
    RegisterForm
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