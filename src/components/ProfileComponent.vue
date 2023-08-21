<template>
  <ProfileDetails v-if="!!clientData" :name="getName()" :username="clientData.data.username"></ProfileDetails>
  <v-card v-if="myAcc">
    <v-tabs
        v-model="tab"
        color="blue-darken-2"
        align-tabs="center"
    >
      <v-tab :value="1">Posts</v-tab>
      <v-tab :value="2">Auctions</v-tab>
      <v-tab :value="3">Orders</v-tab>
      <v-tab :value="4">Connections</v-tab>
      <v-tab :value="5">Edit profile</v-tab>
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

  <div v-if="!!clientData && tab === 1">
    <div v-for="post in clientData.data.posts" :key="post.id">
      <PostCard :id="post.id"></PostCard>
    </div>
  </div>

  <v-sheet v-if="!!clientData && tab === 2" class="mx-auto" elevation="8">
    <v-slide-group
        v-model="model"
        class="pa-4"
        selected-class="bg-primary"
        mandatory
        show-arrows
    >
      <v-slide-group-item
          v-for="auction in auctions"
          :key="auction.id"
      >
        <div>
          <v-hover v-slot="{ isHovering, props }">
            <v-card
                class="ml-2 mr-2"
                color="grey-lighten-4"
                max-width="400"
                v-bind="props"
            >
              <v-img
                  :aspect-ratio="16/9"
                  :cover="true"
                  :src="getImageSrc(auction.image)"
              >
                <v-expand-transition>
                  <div
                      v-if="isHovering"
                      class="d-flex transition-fast-in-fast-out bg-blue-darken-1 v-card--reveal text-h2"
                      style="height: 100%;"
                  >
                    {{ 'Start bid: ' + auction.start_bid + '€' }}
                  </div>
                </v-expand-transition>
              </v-img>

              <v-card-text class="pt-6">
                <div class="font-weight-light text-grey text-h6 mb-2">
                  {{ 'For auction by ' + auction.listed_by_name + ' 🎨'}}
                </div>

                <h3 class="text-h5 text-grey-darken-4 mb-2">
                  {{ 'Introducing: ' + auction.title }}
                </h3>

                <div class="text-grey text-h6 mb-2">
                  {{ '👩‍🎨 Artist Spotlight: : ' + auction.artist }}
                </div>

                <v-btn
                    class="text-grey-darken-4 mt-3"
                    prepend-icon="text-grey-darken-4 mdi-gavel"
                    variant="tonal"
                    width="400"
                    @click="goToAuction(auction.id)"
                >
                  Go to auction page
                </v-btn>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>

  <div v-if="!!clientData && tab === 3">
    <div v-for="order in orders" :key="order.id">
      <v-card
          class="mx-auto mt-3"
          width="800"
      >
        <v-card-title>
          Order id: {{ order.id }}
        </v-card-title>

        <v-card-subtitle>
          Final amount: {{ order.final_amount }}€
        </v-card-subtitle>

        <v-card-text>
          <div>Payment: {{ order.payment }}</div>

          <div>Address: {{ order.address }}</div>
        </v-card-text>

        <v-card-actions>
          <v-btn
              color="orange-lighten-2"
              variant="text"
              @click="show = !show"
          >
            See order items
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
              :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="show = !show"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-sheet
                  class="mx-auto"
                  elevation="8"
                  max-width="800"
              >
                <v-slide-group
                    v-model="model"
                    class="pa-4"
                    selected-class="bg-success"
                    show-arrows
                >
                  <v-slide-group-item
                      v-for="artwork in order.artworks"
                      :key="artwork.id"
                  >
                    <v-card
                        color="grey-lighten-1"
                        :class="'ma-4'"
                        height="400"
                        width="200"
                    >
                      <v-img
                          :aspect-ratio="16/9"
                          :cover="true"
                          :src="getImageSrc(artwork.image)"
                      > </v-img>
                      <v-card-title>
                        {{ artwork.artwork.title }}
                      </v-card-title>
                      <v-card-subtitle>
                        {{ artwork.artwork.artist }}
                      </v-card-subtitle>
                      <v-card-text>
                        Quantity: {{ artwork.quantity }}
                      </v-card-text>
                      <v-card-text>
                        Total: {{ artwork.total }}€
                      </v-card-text>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </v-sheet>
          </div>
        </v-expand-transition>
      </v-card>
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
    auctions: null,
    images: {},
    model: null,
    show: false,
    orders: null,
    orderImages: {},
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.myAccount();
    this.fetchData();
    this.fetchDataAuction();
    this.fetchDataOrders();

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
    async fetchDataAuction() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/auctions', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

        this.auctions = response.data.data;

        this.auctions.forEach(auction => {
          this.fetchImage(auction.image);
        });

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchImage(id) {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get(`/artworks/images/` + id, {
          responseType: 'arraybuffer',
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.images[id] = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    getImageSrc(id) {
      if (this.images && this.images[id]) {
        return this.images[id];
      }
    },
    goToAuction(auction_id) {
      this.$router.push({ name: 'AuctionPage', params: { id: parseInt(auction_id) } });
    },
    async fetchDataOrders() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.orders = response.data.data;
        this.orders.forEach(order => {
          order.artworks.forEach(item => {
            this.fetchImage(item.image);
          });
        });
      } catch (error) {
        console.error('Error fetching image:', error);
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
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>