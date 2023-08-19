<template>
  <v-banner
      icon="mdi-book-information-variant"
      lines="one"
      :stacked="false"
      class="text-h5 mt-10"
  >
    <v-banner-text class="text-h5 mt-1">
      Checkout data
    </v-banner-text>
  </v-banner>
  <v-card
      class="custom-position pt-4"
  >
    <v-alert
        color="blue darken-2"
        theme="dark"
        icon="mdi-currency-eur"
        density="compact"
    >
      Your cart total is: {{ total_amount }} Euro
    </v-alert>
    <v-container>
      <v-text-field
          v-model="first_name"
          color="blue darken-2"
          prepend-inner-icon="mdi-account-outline"
          label="First name"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="last_name"
          color="blue darken-2"
          prepend-inner-icon="mdi-account-circle-outline"
          label="Last name"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="middle_name"
          color="blue darken-2"
          prepend-inner-icon="mdi-account-box-outline"
          label="Middle name (optional)"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="email"
          color="blue darken-2"
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="phone"
          color="blue darken-2"
          prepend-inner-icon="mdi-phone-outline"
          label="Phone number"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="address"
          color="blue darken-2"
          prepend-inner-icon="mdi-map-marker-outline"
          label="Address"
          variant="underlined"
      ></v-text-field>

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-caption">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-radio-group label="Payment method" v-model="payment">
      <v-radio
          color="blue darken-2"
          label="Bank transfer"
          value="Bank transfer"
      ></v-radio>
      <v-radio
          color="blue darken-2"
          label="Credit card"
          value="Credit card"
      ></v-radio>
      <v-radio
          color="blue darken-2"
          label="PayPal"
          value="PayPal"
      ></v-radio>
      <v-radio
          color="blue darken-2"
          label="Cash payment on delivery"
          value="Cash payment"
      ></v-radio>
    </v-radio-group>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="blue darken-2" @click="order">
        Send order

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};

export default {
  name: "CartForm",
  data() {
    return {
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      phone: "",
      address: "",
      errors: "",
      payment: null,
      userData: {},
      total_amount: 0,
    };
  },
  mounted() {
    this.fetchData();
    this.total();

    setInterval(() => {
      this.total();
    }, 2000);
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/clients/checkout/userdata', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.userData = response.data.data;

        this.first_name = this.userData.first_name;
        this.last_name = this.userData.last_name;
        this.middle_name = this.userData.middle_name;
        this.email = this.userData.email;
        this.phone = this.userData.phone;

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async total() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/cart/total', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.total_amount = response.data.total;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async order() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/orders', {
          ordered_via: 'sale',
          final_amount: this.total_amount,
          payment: this.payment,
          address: this.address,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        this.$router.push({ name: 'Home' });

      }
    }
  }
}
</script>

<style scoped>
.custom-position {
  padding-left: calc(50% - 300px);
  padding-right: calc(50% - 300px);
}
</style>