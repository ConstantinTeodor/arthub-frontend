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
      <h3>Recover your password</h3>
    </v-card-title>
    <v-container>
      <v-text-field
          v-if="step === 1"
          v-model="email"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          label="Your account's e-mail"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-if="step === 2"
          v-model="token"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          label="Token"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-if="step === 2"
          v-model="email"
          color="primary"
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-if="step === 2"
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
          v-if="step === 2"
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

      <v-card-text class="text-center" v-if="step === 1">
        <a
            class="text-white text-decoration-none"
            @click="changeStep"
            rel="noopener noreferrer"
            target="_blank"
        >
          Received the token? <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

      <v-card-text class="text-center">
        <a
            class="text-white text-decoration-none"
            @click="redirectLogin"
            rel="noopener noreferrer"
            target="_blank"
        >
          Go back to login page <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="danger" @click="resetRequest" v-if="step === 1">
        Send token

        <v-icon icon="mdi-chevron-right" :end="true"></v-icon>
      </v-btn>

      <v-btn color="danger" @click="reset" v-if="step === 2">
        Change password

        <v-icon icon="mdi-chevron-right" :end="true"></v-icon>
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
  name: "PasswordRecoveryForm",
  data: () => ({
    email: null,
    token: null,
    password: null,
    confirmPassword: null,
    step: 1,
    errors: null,
  }),
  methods: {
    changeStep() {
      if (this.step === 1) {
        this.step = 2;
      } else {
        this.step = 1;
      }
    },
    reset() {
      if (this.password !== this.confirmPassword) {
        this.errors = 'Passwords do not match';
        return;
      }

      this.errors = null;

      axios.put('/user/reset', {
        email: this.email,
        token: this.token,
        password: this.password,
      })
          .then( response => {
            console.log(response);
          })
          .catch( error => {
            this.errors = error.response.data.message
          })
          .finally(() => {
            this.$router.push({ name: 'LogIn' });
          })
    },
    redirectLogin() {
      this.$router.push({ name: 'LogIn' });
    },
    async resetRequest() {
      try {
        await axios.get('/forgot-password/' + this.email)
        this.step = 2;
      } catch (e) {
        this.errors = e.response.data.message
      }
    }
  }
}
</script>

<style scoped>
.custom-position {
  margin-top: 150px;
  left: 28%;
}

.custom-2-position {
  position: absolute;
  margin-top: 250px;
  left: 8%;
}
</style>