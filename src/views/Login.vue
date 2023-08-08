<template>
  <div class="background">
    <TopNavigationBar/>
    <LogInForm/>
  </div>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import LogInForm from "@/components/LogInForm.vue";
export default {
  name: "LogIn",
  components: {
    TopNavigationBar,
    LogInForm
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