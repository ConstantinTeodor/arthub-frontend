<template>
  <v-banner
      icon="mdi-new-box"
      lines="one"
      :stacked="false"
      class="text-h5 mt-10"
  >
    <v-banner-text class="text-h5 mt-1">
      Check out the latest artworks on sale!
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
                    {{ sale.price + '€' }}
                  </div>
                </v-expand-transition>
              </v-img>

              <v-card-text class="pt-6">
                <div class="font-weight-light text-grey text-h6 mb-2">
                  {{ 'For sale by ' + sale.listed_by_name + ' 🎨'}}
                </div>

                <h3 class="text-h5 text-grey-darken-4 mb-2">
                  {{ 'Introducing: ' + sale.title }}
                </h3>

                <div class="text-grey text-h6 mb-2">
                  {{ '👩‍🎨 Artist Spotlight: : ' + sale.artist }}
                </div>

                <v-btn
                    class="text-grey-darken-4 mt-3"
                    prepend-icon="text-grey-darken-4 mdi-cart-arrow-down"
                    variant="tonal"
                    width="400"
                    @click="addCart(sale.artwork_id, sale.price)"
                >
                  Add to cart
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
  name: "NewsList",
  data: () => ({
    model: null,
    sales: null,
    images: {},
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
        const response = await axios.get('/sales/latest', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.sales = response.data.data;

        this.sales.forEach(sale => {
          this.fetchImage(sale.image);
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
    async addCart(artworkId, price) {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/cart', {
          artwork_id: artworkId,
          price: price,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
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