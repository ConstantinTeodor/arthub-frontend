<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <CartItems/>
      <CartForm/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import CartItems from "@/components/CartItems.vue";
import CartForm from "@/components/CartForm.vue";
export default {
  name: "CheckOut",
  components: {
    TopNavigationBar,
    CartItems,
    CartForm,
  },
}
</script>

<style scoped>

</style>