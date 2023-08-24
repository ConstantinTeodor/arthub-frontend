<template>
  <v-app-bar
      v-if="!isProfile"
      scroll-behavior="hide"
      scroll-threshold="100"
      :elevation="0"
      color="rgba(20, 20, 20, 1)"
      :height="200">
      <v-img
          @click="$router.push({ name: 'Home' })"
          class="logo"
          :width="400"
          aspect-ratio="1/1"
          src="~@/assets/logo.png"
      ></v-img>
  </v-app-bar>
  <v-app-bar
      v-else
      scroll-behavior="hide"
      scroll-threshold="100"
      :elevation="0"
      color="rgba(20, 20, 20, 1)"
      :height="0">
    <v-img
        @click="$router.push({ name: 'Home' })"
        class="logo"
        :width="400"
        aspect-ratio="1/1"
        src="~@/assets/logo.png"
    ></v-img>
  </v-app-bar>

  <v-app-bar
      scroll-behavior="elevate"
      :elevation="2"
      color="rgba(26, 26, 26, 1)">
    <template v-if="!!isAuthenticated" v-slot:prepend>
      <v-btn v-if="!isProfile" prepend @click="addPostForm">
        <v-icon>mdi-plus</v-icon>
        Add a post
      </v-btn>

      <v-btn v-else @click="home" icon="mdi-home"></v-btn>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-magnify" @click="overlay = !overlay"></v-btn>

      <v-btn icon="mdi-shopping" @click="marketplace"></v-btn>

      <v-btn icon="mdi-cart" @click="checkout"></v-btn>

      <v-btn v-if="!!isAuthenticated" icon="mdi-message" @click="chat"></v-btn>

      <v-btn v-if="!!isAuthenticated" icon="mdi-account" @click="profile"></v-btn>

      <v-btn v-if="!!isAuthenticated" icon="mdi-logout" @click="logout"></v-btn>
      <v-btn v-else icon="mdi-login" @click="login"></v-btn>

      <v-badge
          v-if="countNotifications > 0"
          color="danger"
          :dot="true"
      >
        <v-icon icon="mdi-bell" @click="notificationOverlay = !notificationOverlay"></v-icon>
      </v-badge>

      <v-icon v-else icon="mdi-bell" @click="notificationOverlay = !notificationOverlay"></v-icon>

    </template>
  </v-app-bar>
  <v-overlay v-model="overlay">
    <div class="d-flex justify-content-center align-items-center vw-100 vh-100">
      <v-card width="600" height="1000">
        <template v-slot:append>
          <v-btn icon="mdi-close" @click="overlay = !overlay">
          </v-btn>
        </template>
        <v-container :style="{ height: '100px' }">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="searchText"
                      :append-icon="'mdi-send'"
                      :prepend-inner-icon="'mdi-magnify'"
                      variant="filled"
                      clear-icon="mdi-close-circle"
                      :clearable="true"
                      label="Who you are looking for?"
                      type="text"
                      @click:append="search"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-container>
        <v-container class="overflow-y-scroll" :style="{ height: '830px' }">
          <div v-for="user in users" :key="user.id">
            <ClientSearch :user="user" @closeOverlay="overlay = !overlay" />
          </div>
        </v-container>
      </v-card>
    </div>
  </v-overlay>
  <v-overlay v-model="notificationOverlay">
    <div class="d-flex justify-content-center align-items-center vw-100 vh-100">
      <v-card width="600" height="1000">
        <template v-slot:prepend>
          <v-btn
              class="mt-6"
              v-if="countNotifications > 0"
              prepend-icon="mdi-read"
              @click="markAllAsRead"
          >
            Mark all as read
          </v-btn>
        </template>
        <template v-slot:append>
          <v-btn icon="mdi-close" @click="notificationOverlay = !notificationOverlay">
          </v-btn>
        </template>
        <v-container :style="{ height: '900px', marginTop: '30px' }" class="overflow-y-scroll">
          <div v-for="notification in notifications" :key="notification.id">
            <v-card
                @click="markAsRead(notification.id, notification.from_id)"
                v-if="notification.status === 'unread'"
                class="mx-auto"
                prepend-icon="mdi-chat-alert-outline"
            >
              <template v-slot:title>
                {{ notification.title }}
              </template>

              <v-card-text>
                {{ notification.message }}
              </v-card-text>
            </v-card>
            <v-card
                v-else
                @click="markAsRead(notification.id, notification.from_id)"
                class="mx-auto"
                prepend-icon="mdi-chat-outline"
            >
              <template v-slot:title>
                {{ notification.title }}
              </template>

              <v-card-text>
                {{ notification.message }}
              </v-card-text>
            </v-card>
          </div>
        </v-container>
      </v-card>
    </div>
  </v-overlay>
</template>

<script>
import ClientSearch from "@/components/ClientSearch.vue";
import { mapGetters } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "TopNavigationBar",
  components: {
    ClientSearch,
  },
  data() {
    return {
      myId: null,
      isProfile: false,
      overlay: false,
      searchText: null,
      users: null,
      notifications: null,
      countNotifications: null,
      notificationOverlay: false,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.isProfilePage();
    this.fetchNotifications();
  },
  watch: {
    $route(to) {
      if (to.path.includes('/profile')) {
        this.isProfile = true;
      } else {
        this.isProfile = false;
      }
    }
  },
  methods: {
    logout() {
      axios.post('/auth/logout', {},
          {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
          })
          .then( response => {
            console.log(response);
            this.$store.commit('clearToken');
          })
          .catch( error => {
            console.log(error);
          });
    },
    login() {
      this.$router.push({ name: 'LogIn' });
    },
    addPostForm() {
      this.$router.push({ name: 'AddPost' });
    },
    async profile() {
      try {
        await this.getMyId();
        this.$router.push({ name: 'Profile', params: { id: parseInt(this.myId) } });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async getMyId () {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/clients/myAccount/myId', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });

        this.myId = response.data.id;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    isProfilePage() {
      this.isProfile = window.location.href.includes('/profile');
    },
    home() {
      this.$router.push({ name: 'Home' });
    },
    marketplace() {
      this.$router.push({ name: 'Marketplace' });
    },
    checkout() {
      this.$router.push({ name: 'Checkout' });
    },
    async search() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/clients/search/' + this.searchText, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });

        this.users = response.data.data;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchNotifications() {
      try {
        if (!this.isAuthenticated) {
          return;
        }
        const response = await axios.get('/notifications', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });

        this.notifications = response.data.data.notifications;
        this.countNotifications = response.data.data.unread_notifications;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async markAsRead(id, from_id) {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/notifications/read', {
          notification_id: id
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });

        this.notificationOverlay = false;
        this.$router.push({ name: 'Profile', params: { id: parseInt(from_id) } });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async markAllAsRead() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/notifications/readAll', {}, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });
        await this.fetchNotifications();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    chat() {
      this.$router.push({ name: 'Conversations' });
    },
  }
}
</script>

<style scoped>
  .logo {
    margin-left: calc(50% - 200px);
    margin-right: calc(50% - 200px);
  }
</style>