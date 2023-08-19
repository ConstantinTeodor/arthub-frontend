<template>
  <v-banner
      icon="mdi-tag-faces"
      lines="one"
      :stacked="false"
      class="text-h5 mt-10"
  >
    <v-banner-text class="text-h5 mt-1">
      Your cart items!
    </v-banner-text>
  </v-banner>
  <v-sheet v-if="!!sales" class="mx-auto" elevation="8">
    <v-slide-group
        v-model="model"
        class="pa-4"
        selected-class="bg-primary"
        mandatory
        show-arrows
    >
      <v-slide-group-item
          v-for="sale in sales"
          :key="sale.id"
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
                  :src="getImageSrc(sale.image)"
              >
                <v-expand-transition>
                  <div
                      v-if="isHovering"
                      class="d-flex transition-fast-in-fast-out bg-blue-darken-1 v-card--reveal text-h2"
                      style="height: 100%;"
                  >
                    {{ sale.base_price * quantity[sale.artwork_id] + '€' }}
                  </div>
                </v-expand-transition>
              </v-img>

              <v-card-text class="pt-6">

                <h3 class="text-h5 text-grey-darken-4 mb-2">
                  {{ 'Introducing: ' + sale.title }}
                </h3>

                <div class="text-grey text-h6 mb-2">
                  {{ '👩‍🎨 Artist Spotlight: : ' + sale.artist }}
                </div>

                <v-combobox
                    v-model="quantity[sale.artwork_id]"
                    label="Quantity"
                    :items="quantityOptions(sale.available, sale.quantity)"
                    variant="underlined"
                ></v-combobox>

                <v-btn
                    v-if="quantity[sale.artwork_id] !== sale.quantity"
                    class="text-grey-darken-4 mt-3"
                    prepend-icon="text-red-darken-2 mdi-numeric"
                    variant="tonal"
                    width="400"
                    @click="updateQuantity(sale.artwork_id, quantity[sale.artwork_id], quantity[sale.artwork_id] * sale.base_price)"
                >
                  Save new quantity
                </v-btn>

                <v-btn
                    class="text-grey-darken-4 mt-3"
                    prepend-icon="text-red-darken-2 mdi-delete"
                    variant="tonal"
                    width="400"
                    @click="deleteCart(sale.artwork_id)"
                >
                  Delete from cart
                </v-btn>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "CartItems",
  data: () => ({
    model: null,
    sales: null,
    images: {},
    quantity: {},
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.sales = response.data.data;

        this.sales.forEach(sale => {
          this.fetchImage(sale.image);
          this.quantity[sale.artwork_id] = sale.quantity;
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
    async deleteCart(id) {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.delete(`/cart/` + id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        await this.fetchData();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async updateQuantity(id, quantity, amount) {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        console.log(id, quantity, amount, this.quantity);
        await axios.put(`/cart/quantity`, {
          artwork_id: parseInt(id),
          quantity: parseInt(quantity),
          total_amount: parseFloat(amount),
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        await this.fetchData();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    quantityOptions(available) {
      const options = [];
      for (let i = 1; i <= available; i++) {
        options.push(i);
      }
      return options;
    },
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>