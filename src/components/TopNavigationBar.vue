<template>
  <v-app-bar
      :elevation="0"
      color="rgba(20, 20, 20, 1)"
      :height="200"
      scroll-behavior="hide">
      <v-img
          class="logo"
          :width="400"
          aspect-ratio="1/1"
          src="~@/assets/logo.png"
      ></v-img>
  </v-app-bar>

  <v-app-bar
      :elevation="2"
      color="rgba(26, 26, 26, 1)">
    <template v-if="!!isAuthenticated" v-slot:prepend>
      <v-btn prepend @click="addPostForm">
        <v-icon>mdi-plus</v-icon>
        Add a post
      </v-btn>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-heart"></v-btn>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn v-if="!!isAuthenticated" icon="mdi-logout" @click="logout"></v-btn>
      <v-btn v-else icon="mdi-login" @click="login"></v-btn>

    </template>
  </v-app-bar>
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
  computed: {
    ...mapGetters(['isAuthenticated']),
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
    }
  }
}
</script>

<style scoped>
  .logo {
    margin-left: calc(50% - 200px);
    margin-right: calc(50% - 200px);
  }
</style>