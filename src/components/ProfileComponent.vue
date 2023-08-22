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

  <div v-if="!!clientData && tab === 4">
    <v-card class="mx-auto mt-3" max-width="300">
      <v-list density="compact">
        <v-list-subheader>{{clientData.data.username}} connections</v-list-subheader>

        <v-list-item
            class="mt-2"
            v-for="connection in connections"
            :key="connection.id"
            color="primary"
            @click="goToConnection(connection.client_id)"
        >

          <v-list-item-title>
            <v-avatar
                color="grey-darken-3"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-avatar>
            <span class="ml-2"> {{ connection.client_name }} </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
  <div v-if="!!clientData && tab === 5">
    <v-container>
      <v-text-field
          v-model="username"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          label="Username"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="email"
          color="primary"
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="phone"
          color="primary"
          prepend-inner-icon="mdi-phone-outline"
          label="Phone number"
          variant="underlined"
      ></v-text-field>
      <v-text-field
          v-model="first_name"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          label="First name"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="last_name"
          color="primary"
          prepend-inner-icon="mdi-account-circle-outline"
          label="Last name"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="middle_name"
          color="primary"
          prepend-inner-icon="mdi-account-box-outline"
          label="Middle name (optional)"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="date_of_birth"
          color="primary"
          label="Date of birth"
          variant="underlined"
          prepend-inner-icon="mdi-calendar"
          @click:prepend-inner="$refs.datePicker.openMenu()"
      ></v-text-field>

      <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          color="primary"
          prepend-inner-icon="mdi-lock-outline"
          label="New password"
          variant="underlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-text-field
          v-model="confirmPassword"
          :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible2 ? 'text' : 'password'"
          color="primary"
          prepend-inner-icon="mdi-lock-outline"
          label="Confirm new password"
          variant="underlined"
          @click:append-inner="visible2 = !visible2"
      ></v-text-field>

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-caption">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

      <v-btn color="blue-darken-2" @click="updateClient">
        Save profile data

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-container>
  </div>
  <VueDatePicker
      ref="datePicker"
      v-model="rawDateOfBirth"
      :teleport-center="true"
      :dark="true"
      class="picker"
      format="dd-MM-yyyy"
  ></VueDatePicker>
</template>

<script>
import PostCard from "@/components/PostCard.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
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
    VueDatePicker,
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
    connections: null,
    first_name: null,
    last_name: null,
    middle_name: null,
    errors: null,
    rawDateOfBirth: null,
    date_of_birth: null,
    password: null,
    confirmPassword: null,
    username: null,
    email: null,
    phone: null,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),

    formattedDateOfBirth() {
      if (!this.rawDateOfBirth) return null;
      const date = new Date(this.rawDateOfBirth);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }
  },
  mounted() {
    this.myAccount();
    this.fetchData();
    this.fetchDataAuction();
    this.fetchDataOrders();
    this.fetchDataConnections();

    setInterval(() => {
      if (window.location.pathname.includes('/profile')) {
        this.fetchData();
      }
    }, 10000);
  },
  watch: {
    rawDateOfBirth() {
      this.date_of_birth = this.formattedDateOfBirth;
    },
    date_of_birth(newValue) {
      const parts = newValue.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        this.rawDateOfBirth = new Date(`${year}-${month}-${day}`);
      }
    }
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

        if (this.clientData.data.me) {
          this.first_name = this.clientData.data.first_name;
          this.last_name = this.clientData.data.last_name;
          this.middle_name = this.clientData.data.middle_name;
          this.username = this.clientData.data.username;
          this.email = this.clientData.data.email;
          this.phone = this.clientData.data.phone;
          this.date_of_birth = this.clientData.data.date_of_birth;
        }
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
    async fetchDataConnections() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/connections', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.connections = response.data.data;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    goToConnection(id) {
      this.$router.push({ name: 'Profile', params: { id: parseInt(id) } });
    },
    async updateClient() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.put('/clients', {
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          date_of_birth: this.date_of_birth,
          username: this.username,
          email: this.email,
          phone: this.phone,
          password: this.password,
          password_confirmation: this.confirmPassword,
        },
            {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        window.location.reload();
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
.picker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>