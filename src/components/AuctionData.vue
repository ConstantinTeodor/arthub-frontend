<template>
  <v-card
      v-if="!!auction"
      :loading="loading"
      class="mx-auto my-12"
      max-width="800"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          :indeterminate="true"
      ></v-progress-linear>
    </template>

    <v-img
        height="600"
        aspect-ratio="1"
        :cover="true"
        :src="url"
    ></v-img>

    <v-card-item>
      <v-card-title>{{ auction.name }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">{{ auction.title + ' by ' + auction.artist }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>

      <div class="my-4 text-subtitle-1">
        € • Auction starting bid: €{{ auction.start_bid }}
      </div>
      <div v-if="auction.started" class="my-4 text-subtitle-1">
        € • Auction current bid: €{{ auction.current_bid }}
      </div>
      <div v-if="auction.ended" class="my-4 text-subtitle-1">
        € • Auction winning bid: €{{ auction.current_bid }}
      </div>

      <v-text-field
          color="white"
          v-if="auction.participating === 'true' && auction.started"
          v-model="bid"
          prepend-inner-icon="mdi-cash-multiple"
          label="Your bid"
          variant="underlined"
          :append-icon="'mdi-send'"
          @click:append="bidFunc"
          :rules="numberRuleInteger"
      ></v-text-field>

      <v-card class="mb-12 mt-3" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis">
          <span> Your maximum bid: €{{ this.available_sum }}. </span>
          <span v-if="lastBid !== 0"> Your last bid: €{{ this.lastBid }}.</span>
        </v-card-text>
      </v-card>

      <v-card v-if="!!errorsBid" class="mb-12 mt-3" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-danger">
          <span v-html="errorsBid"></span>
        </v-card-text>
      </v-card>

    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title v-if="!auction.started">Time left until start</v-card-title>
    <Countdown class="d-flex justify-center mt-3" v-if="!auction.started" :untilTime="auction.not_formatted_start_date"></Countdown>

    <v-card-title v-if="auction.started && !auction.ended">Time left until finish</v-card-title>
    <Countdown class="d-flex justify-center mt-3" v-if="auction.started && !auction.ended" :untilTime="auction.not_formatted_end_date"></Countdown>

    <v-card-title v-if="auction.ended">Auction finished</v-card-title>

    <v-card-actions class="mt-5">
      <v-btn
          v-if="auction.participating === 'true'"
          color="blue-darken-2"
          variant="text"
          @click="participateRemove"
      >
        Remove participation
      </v-btn>
      <v-btn
          v-else-if="!auction.started"
          color="blue-darken-2"
          variant="text"
          @click="showField = !showField"
      >
        Join {{ auction.name }}
      </v-btn>

    </v-card-actions>

    <v-text-field
        class="ml-3 mr-3"
        color="white"
        v-if="showField"
        v-model="available_sum"
        prepend-inner-icon="mdi-currency-eur"
        label="Your maximum spending amount"
        variant="underlined"
        :append-icon="'mdi-send'"
        @click:append="participate"
        :rules="numberRuleInteger"
    ></v-text-field>

    <v-card v-if="!!errors" class="mb-12 mt-3" color="surface-variant" variant="tonal">
      <v-card-text
          class="text-medium-emphasis text-danger">
        <span v-html="errors"></span>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import Countdown from "@/components/Countdown.vue";

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "AuctionData",
  components: {
    Countdown,
  },
  props: {
    auction_id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    url: null,
    auction: null,
    available_sum: null,
    showField: false,
    errors: null,
    numberRuleInteger: [
      v => !!v || 'Field is required',
      v => /^\d+(\.\d+)?$/.test(v) || 'Please write a valid number.'
    ],
    bid: null,
    lastBid: null,
    errorsBid: null,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchDataAuction();
  },
  methods: {
    async fetchImage() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get(`/artworks/images/` + this.auction.image, {
          responseType: 'arraybuffer',
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.url = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async fetchDataAuction() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/auctions/' + this.auction_id,{
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

        this.auction = response.data.data;
        if (this.auction.participating === 'true') {
          this.available_sum = this.auction.available_sum;
          this.lastBid = this.auction.bid === null ? 0.0 : this.auction.bid;
        }
        await this.fetchImage();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async participate() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        if (this.available_sum === null || isNaN(parseFloat(this.available_sum))) {
          this.errors = 'Please enter a valid amount';
          return;
        }
        await axios.post('/auctions/participate', {
          auction_id: this.auction_id,
          available_sum: this.available_sum,
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.errors = null;
        this.showField = false;
        this.available_sum = null;
        await this.fetchDataAuction();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async participateRemove() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/auctions/participate', {
          auction_id: this.auction_id,
          available_sum: 0,
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await this.fetchDataAuction();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async bidFunc() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/auctions/bid', {
          auction_id: this.auction_id,
          bid: this.bid,
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.errorsBid = null;
        await this.fetchDataAuction();
      } catch (error) {
        this.errorsBid = error.response.data.message;
      }
    },
  },
}
</script>

<style scoped>

</style>