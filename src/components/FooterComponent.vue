<template>
  <v-footer
      v-if="!!isAuthenticated"
      class="text-center d-flex flex-column mt-5 background"

  >

    <div class="custom">
      <span class="text-h5"> Experiencing any problems? Having any questions? Contact us! </span>
    </div>

    <div :style="{ width: '700px' }">
      <v-text-field
          class="mr-3"
          v-model="message"
          :append-icon="'mdi-send'"
          variant="filled"
          clear-icon="mdi-close-circle"
          :clearable="true"
          label="Type a message"
          type="text"
          @click:append="sendMessage"
          @keyup.enter="sendMessage"
      ></v-text-field>
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} — <strong>ArtHub</strong>
    </div>

  </v-footer>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "FooterComponent",
  data() {
    return {
      message: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async sendMessage() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        if (!this.message) {
          return;
        }
        await axios.post('/contact', {
          message: this.message,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });
        this.message = null;
      } catch (error) {
        console.error(error);
      }
    },
  }
}
</script>

<style scoped>
.background {
  background-image: url('../assets/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  border-top: 8px solid rgba(20, 20, 20, 1);
}
.custom {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>