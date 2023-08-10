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
      <h3>Profile details</h3>
    </v-card-title>
    <v-container>
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

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-caption">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="danger" @click="register">
        Save profile data

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

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
import { mapGetters } from 'vuex';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "RegisterForm",
  components: { VueDatePicker },
  data: () => ({
    first_name: null,
    last_name: null,
    middle_name: null,
    errors: null,
    rawDateOfBirth: null,
    date_of_birth: null,

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
    register() {
      if (this.password !== this.confirmPassword) {
        this.errors = 'Passwords do not match';
        return;
      }

      this.errors = null;

      if (!this.isAuthenticated) {
        this.$router.push({ name: 'Login' });
        return;
      }

      axios.post('/clients', {
        first_name: this.first_name,
        last_name: this.last_name,
        middle_name: this.middle_name,
        date_of_birth: this.date_of_birth,
      },
          {
            headers: {
              'Authorization': 'Bearer ' + this.isAuthenticated
            }
          },)
          .then( response => {
            console.log(response);
            this.$router.push({ name: 'Home' });
          })
          .catch( error => {
            console.log(error)
            this.errors = error.response.data.message
          });
    },
  }
}
</script>

<style scoped>
.custom-position {
  margin-top: 50px;
  left: 28%;
}

.custom-2-position {
  position: absolute;
  margin-top: 250px;
  left: 8%;
}

.picker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>