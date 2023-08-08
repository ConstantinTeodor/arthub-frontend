<template>
  <div class="background">
    <TopNavigationBar/>
    <RegisterClientForm/>
  </div>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import RegisterClientForm from "@/components/RegisterClientForm.vue";
export default {
  name: "RegisterPage",
  components: {
    TopNavigationBar,
    RegisterClientForm
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