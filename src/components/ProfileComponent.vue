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

  <v-btn
      width="300px"
      v-if="status === 0"
      class="positioning"
      @click="addConnection"
  >
    Request connection
  </v-btn>

  <v-btn
      width="300px"
      v-if="status === 3"
      class="positioning"
      @click="removeConnection"
  >
    Remove request
  </v-btn>

  <v-btn
      width="300px"
      v-if="status === 1"
      class="positioning-left"
      @click="acceptConnection"
  >
    Accept connection request
  </v-btn>

  <v-btn
      width="300px"
      v-if="status === 1"
      class="positioning-right"
      @click="declineConnection"
  >
    Decline connection request
  </v-btn>

  <v-btn
      width="300px"
      v-if="status === 2"
      class="positioning"
      @click="removeConnection"
  >
    Remove connection
  </v-btn>

  <v-btn
      width="400px"
      v-if="status === 5"
      class="positioning-denied"
      @click="addConnection"
  >
    Request declined. Request connection
  </v-btn>

  <v-btn
      width="300px"
      v-if="status === 6"
      class="positioning"
      @click="removeConnection"
  >
    Remove request
  </v-btn>

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
    status: null,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.myAccount();
    this.fetchData();

    setInterval(() => {
      if (window.location.pathname.includes('/profile')) {
        this.fetchData();
      }
    }, 2000);
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

        if (!this.myAcc) {
          await this.fetchStatus();
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchStatus() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/connections/status/' + this.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.status = response.data.status;
      } catch (error) {
        console.error('Error fetching data:', error);
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
    },
    async addConnection () {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/connections', {
              receiver_id: this.id,
            },
            {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.status = 3;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async removeConnection () {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.delete('/connections/' + this.id, {
              headers: {
                'Authorization': 'Bearer ' + this.isAuthenticated
              },
            });

        this.status = 0;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async acceptConnection() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.put('/connections', {
          receiver_id: this.id,
          status: 'accepted',
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.status = 2;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async declineConnection() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.put('/connections', {
          receiver_id: this.id,
          status: 'declined',
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.status = 5;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  }
}
</script>

<style scoped>
.positioning {
  margin-left: calc(50% - 150px);
  margin-right: calc(50% - 150px);
}
.positioning-left {
  margin-left: calc(50% - 325px);
  margin-right: 50px;
}
.positioning-right {
  margin-right: calc(50% - 325px);
}
.positioning-denied {
  margin-left: calc(50% - 200px);
  margin-right: calc(50% - 200px);
}
</style>