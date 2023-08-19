<template>
  <v-app-bar
      v-if="!isProfile"
      scroll-behavior="hide"
      scroll-threshold="300"
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
      scroll-threshold="300"
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

      <v-btn v-if="!!isAuthenticated" icon="mdi-account" @click="profile"></v-btn>

      <v-btn v-if="!!isAuthenticated" icon="mdi-logout" @click="logout"></v-btn>
      <v-btn v-else icon="mdi-login" @click="login"></v-btn>

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

        </v-container>
      </v-card>
    </div>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "TopNavigationBar",
  data() {
    return {
      myId: null,
      isProfile: false,
      overlay: true,
      searchText: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.isProfilePage();
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
  }
}
</script>

<style scoped>
  .logo {
    margin-left: calc(50% - 200px);
    margin-right: calc(50% - 200px);
  }
</style>