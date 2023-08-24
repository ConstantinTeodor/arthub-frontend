<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <ConversationsComponent/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import ConversationsComponent from "@/components/ConversationsComponent.vue";
export default {
  name: "ConversationPage",
  components: {
    TopNavigationBar,
    ConversationsComponent,
  },
}
</script>

<style scoped>

</style>