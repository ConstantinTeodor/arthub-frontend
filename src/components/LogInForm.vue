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
      <h3>Sign in</h3>
    </v-card-title>
    <v-container>
      <v-text-field
          v-model="email"
          color="primary"
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
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

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-caption">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

      <v-card-text class="text-center">
        <a
            class="text-white text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
        >
          Forgot password? <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

      <v-card-text class="text-center">
        <a
            class="text-white text-decoration-none"
            @click="redirectRegister"
            rel="noopener noreferrer"
            target="_blank"
        >
          Sign up now! <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="danger" @click="login">
        Access Account

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "LogInForm",
  data: () => ({
    email: null,
    password: null,
    remember: null,
    visible: false,
    errors: null,
  }),
  methods: {
    login() {
      axios.post('/auth/login', {
        email: this.email,
        password: this.password,
      })
          .then((response) => {
            this.$store.commit('setToken', response.data.token);

            this.$router.push({ name: 'Home' });
          })
          .catch((error) => {
            console.log(error)
            this.errors = error.response.data.message
          });
    },
    redirectRegister() {
      this.$router.push({ name: 'Register' });
    },
  }
}
</script>

<style scoped>
  .custom-position {
    margin-top: 500px;
    left: 28%;
  }

  .custom-2-position {
    position: absolute;
    margin-top: 600px;
    left: 8%;
  }
</style>