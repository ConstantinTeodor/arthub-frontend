<template>
  <v-banner
      icon="mdi-palette"
      lines="one"
      :stacked="false"
      class="text-h5 mt-10"
  >
    <v-banner-text class="text-h5">
      <span class="mt-1">For Sale Showcase   </span>
      <v-btn v-if="collapseSale" icon="mdi-chevron-down" @click="collapseSale = !collapseSale">
      </v-btn>
      <v-btn v-else icon="mdi-chevron-up" @click="collapseSale = !collapseSale">
      </v-btn>
    </v-banner-text>
  </v-banner>
  <v-container v-if="!collapseSale">
    <v-row justify="space-around">
      <v-combobox
          v-if="!!types"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific type?"
          :items="typeNames"
          v-model="type"
          :style="{ width: '100px' }"
      ></v-combobox>

      <v-combobox
          v-if="!!genres"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific genre?"
          :items="genreNames"
          v-model="genre"
          :style="{ marginLeft: '10px', width: '100px' }"
      ></v-combobox>

      <v-combobox
          v-if="!!artists"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific artist?"
          :items="artistNames"
          v-model="artist"
          :style="{ marginLeft: '10px', width: '100px' }"
      ></v-combobox>
    </v-row>
  </v-container>
  <v-container v-if="!collapseSale">
    <v-row justify="space-around">
      <v-col v-for="sale in sales" :key="sale.id" cols="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
              class="mx-auto"
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
      </v-col>
    </v-row>
  </v-container>
<!-------------------------------------------------------->
  <v-banner
      icon="mdi-palette"
      lines="one"
      :stacked="false"
      class="text-h5 mt-10"
  >
    <v-banner-text class="text-h5">
      <span class="mt-1">For Auction Showcase   </span>
      <v-btn v-if="collapseAuction" icon="mdi-chevron-down" @click="collapseAuction = !collapseAuction">
      </v-btn>
      <v-btn v-else icon="mdi-chevron-up" @click="collapseAuction = !collapseAuction">
      </v-btn>
    </v-banner-text>
  </v-banner>
  <v-container v-if="!collapseAuction">
    <v-row justify="space-around">
      <v-combobox
          v-if="!!types"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific type?"
          :items="typeNames"
          v-model="typeAuction"
          :style="{ width: '100px' }"
      ></v-combobox>

      <v-combobox
          v-if="!!genres"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific genre?"
          :items="genreNames"
          v-model="genreAuction"
          :style="{ marginLeft: '10px', width: '100px' }"
      ></v-combobox>

      <v-combobox
          v-if="!!artists"
          :clearable="true"
          :multiple="true"
          label="Looking for a specific artist?"
          :items="artistNames"
          v-model="artistAuction"
          :style="{ marginLeft: '10px', width: '100px' }"
      ></v-combobox>
    </v-row>
  </v-container>
  <v-container v-if="!collapseAuction">
    <v-row justify="space-around">
      <v-col v-for="auction in auctions" :key="auction.id" cols="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
              class="mx-auto"
              color="grey-lighten-4"
              max-width="400"
              v-bind="props"
          >
            <v-img
                :aspect-ratio="16/9"
                :cover="true"
                :src="getImageSrc(auction.image)"
            >
              <v-expand-transition>
                <div
                    v-if="isHovering"
                    class="d-flex transition-fast-in-fast-out bg-blue-darken-1 v-card--reveal text-h2"
                    style="height: 100%;"
                >
                  {{ 'Start bid: ' + auction.start_bid + '€' }}
                </div>
              </v-expand-transition>
            </v-img>

            <v-card-text class="pt-6">
              <div class="font-weight-light text-grey text-h6 mb-2">
                {{ 'For auction by ' + auction.listed_by_name + ' 🎨'}}
              </div>

              <h3 class="text-h5 text-grey-darken-4 mb-2">
                {{ 'Introducing: ' + auction.title }}
              </h3>

              <div class="text-grey text-h6 mb-2">
                {{ '👩‍🎨 Artist Spotlight: : ' + auction.artist }}
              </div>

              <v-btn
                  class="text-grey-darken-4 mt-3"
                  prepend-icon="text-grey-darken-4 mdi-gavel"
                  variant="tonal"
                  width="400"
                  @click="goToAuction(auction.id)"
              >
                Go to auction page
              </v-btn>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "ArtworkList",
  data: () => ({
    model: null,
    sales: null,
    auctions: null,
    images: {},
    genres: null,
    genre: null,
    genreAuction: null,
    types: null,
    type: null,
    typeAuction: null,
    artists: null,
    artist: null,
    artistAuction: null,
    collapseSale: false,
    collapseAuction: false,
  }),
  mounted() {
    this.getTypes();
    this.getGenres();
    this.getArtists();
    this.fetchData();
    this.fetchDataAuction();
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    typeNames() {
      return this.types.map(type => type.name);
    },
    genreNames() {
      return this.genres.map(genre => genre.name);
    },
    artistNames() {
      return this.artists.map(artist => artist.artist);
    },
  },
  watch: {
    type() {
      this.fetchData();
    },
    genre() {
      this.fetchData();
    },
    artist() {
      this.fetchData();
    },
    typeAuction() {
      this.fetchDataAuction();
    },
    genreAuction() {
      this.fetchDataAuction();
    },
    artistAuction() {
      this.fetchDataAuction();
    },
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.post('/sales/all',{
          genres: this.genre,
          types: this.type,
          artists: this.artist,
        },
            {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log(response);

        this.sales = response.data.data;

        this.sales.forEach(sale => {
          this.fetchImage(sale.image);
        });

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchDataAuction() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.post('/auctions/filtered',{
              genres: this.genreAuction,
              types: this.typeAuction,
              artists: this.artistAuction,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

        this.auctions = response.data.data;

        this.auctions.forEach(auction => {
          this.fetchImage(auction.image);
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
    },
    async getTypes() {
      try {
        const response = await axios.get('/types', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });
        if (response.status === 200) {
          this.types = response.data.types;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getGenres() {
      try {
        const response = await axios.get('/genres', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });
        if (response.status === 200) {
          this.genres = response.data.genres;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getArtists() {
      try {
        const response = await axios.get('/artworks/artists', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        });
        if (response.status === 200) {
          this.artists = response.data.artists;
        }
      } catch (error) {
        console.log(error);
      }
    },
    goToAuction(auction_id) {
      this.$router.push({ name: 'AuctionPage', params: { id: parseInt(auction_id) } });
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