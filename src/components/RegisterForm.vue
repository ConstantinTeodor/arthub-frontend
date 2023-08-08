<template>
  <v-card
      class="mx-auto custom-2-position"
      color="transparent"
      max-width="800">
    <v-card-text>
      <h2>Unleashing creativity. Connect, share, inspire, sell. Join the art revolution, where masterpieces meet marketplaces.</h2>
    </v-card-text>
  </v-card>
  <v-card
      class="mx-auto custom-position"
      max-width="344"
  >
    <v-card-title class="d-flex justify-center mt-4">
      <h3>Sign up</h3>
    </v-card-title>
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
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          color="primary"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          variant="underlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-text-field
          v-model="confirmPassword"
          :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible2 ? 'text' : 'password'"
          color="primary"
          prepend-inner-icon="mdi-lock-outline"
          label="Confirm password"
          variant="underlined"
          @click:append-inner="visible2 = !visible2"
      ></v-text-field>

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-caption">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

      <v-card-text class="text-center">
        <a
            class="text-white text-decoration-none"
            @click="redirectLogin"
            rel="noopener noreferrer"
            target="_blank"
        >
          Have an account? Log in! <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="danger" @click="register">
        Create Account

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "RegisterForm",
  data: () => ({
    username: null,
    email: null,
    phone: null,
    password: null,
    confirmPassword: null,
    errors: null,
    visible: false,
    visible2: false,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        this.errors = 'Passwords do not match';
        return;
      }

      this.errors = null;

      axios.post('/auth/register', {
        username: this.username,
        email: this.email,
        phone_number: this.phone,
        password: this.password,
      })
          .then( response => {
            console.log(response);

            const token = response.data.user.token;

            this.$store.commit('setToken', token);

            this.$router.push({ name: 'Register-Client' });
          })
          .catch( error => {
            console.log(error)
            this.errors = error.response.data.message
          });
    },
    redirectLogin() {
      this.$router.push({ name: 'LogIn' });
    },
  }
}
</script>

<style scoped>
.custom-position {
  margin-top: 400px;
  left: 28%;
}

.custom-2-position {
  position: absolute;
  margin-top: 600px;
  left: 8%;
}
</style>