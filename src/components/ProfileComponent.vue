<template>
  <ProfileDetails v-if="!!clientData" :name="getName()" :username="clientData.data.username"></ProfileDetails>
  <v-card v-if="myAcc">
    <v-tabs
        v-model="tab"
        color="deep-purple-accent-4"
        align-tabs="center"
    >
      <v-tab :value="1">Posts</v-tab>
      <v-tab :value="2">Orders</v-tab>
      <v-tab :value="3">Auctions</v-tab>
    </v-tabs>
  </v-card>
  <div v-if="!!clientData">
    <div v-for="post in clientData.data.posts" :key="post.id">
      <PostCard :id="post.id"></PostCard>
    </div>
  </div>
</template>

<script>
import PostCard from "@/components/PostCard.vue";
import ProfileDetails from "@/components/ProfileDetails.vue";
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "ProfileComponent",
  props: {
    id: {
      required: true,
    },
  },
  components: {
    PostCard,
    ProfileDetails,
  },
  data: () => ({
    tab: null,
    myAcc: false,
    clientData: null,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.myAccount();
    this.fetchData();
  },
  methods: {
    async myAccount() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/clients/myAccount/myId', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });

        if (this.id === parseInt(response.data.id)) {
          this.myAcc = true;
        } else {
          this.myAcc = false;
        }
        console.log(this.myAcc)
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/clients/' + this.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.clientData = response.data;
        console.log(this.clientData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    getName() {
      if (this.clientData.data.middle_name === null) {
        return this.clientData.data.first_name + ' ' + this.clientData.data.last_name;
      } else {
        return this.clientData.data.first_name + ' ' + this.clientData.data.middle_name + ' ' + this.clientData.data.last_name;
      }
    }
  }
}
</script>

<style scoped>

</style>