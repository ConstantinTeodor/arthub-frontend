<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <AuctionData :auction_id="parseInt(auctionId)"/>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import AuctionData from "@/components/AuctionData.vue";
import {useRouter} from "vue-router";

export default {
  name: "AuctionPage",
  components: {
    TopNavigationBar,
    AuctionData
  },
  setup() {
    const router = useRouter();

    const auctionId = router.currentRoute.value.params.id;

    return {
      auctionId
    };
  },
  watch: {
    '$route': function () {
      window.location.reload();
    }
  },
}
</script>

<style scoped>

</style>