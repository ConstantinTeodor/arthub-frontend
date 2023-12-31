<template>
  <v-card v-if="step === 1">

    <v-card-title>
      <span class="headline">Step 1: Add your art!</span>
    </v-card-title>
    <v-container>

      <v-text-field
          v-model="title"
          color="primary"
          prepend-inner-icon="mdi-file-document-outline"
          label="Artwork title"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="artist"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          label="Artist"
          variant="underlined"
      ></v-text-field>

      <v-combobox
          :clearable="true"
          :multiple="true"
          label="What type of artwork is this?"
          :items="typeNames"
          v-model="type"
      ></v-combobox>

      <v-combobox
          :clearable="true"
          :multiple="true"
          label="What is the general genre of this artwork?"
          :items="genreNames"
          v-model="genre"
      ></v-combobox>

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-danger">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-card-actions>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>

  <v-card v-if="step === 2">

    <v-card-title>
      <span class="headline">Step 2: Upload an image of your art!</span>
    </v-card-title>
    <v-container>

      <v-file-input @change="handleFileChange" label="Choose a file"></v-file-input>

      <v-progress-circular
          v-if="uploading"
          indeterminate
          size="64"
          color="primary"
      ></v-progress-circular>

      <div class="d-flex justify-content-center align-items-center my-4">
        <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Uploaded Image"
            class="uploaded-image"
        />
      </div>

      <v-btn v-if="imageUrl" @click="uploadFile">Upload</v-btn>

      <v-card v-if="!!errors" class="mb-12 mt-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-danger">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-card-actions>
      <v-btn @click="previousStep">Previous step</v-btn>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>

  <v-card v-if="step === 3">

    <v-card-title>
      <span class="headline">Step 3: Add a description!</span>
    </v-card-title>
    <v-container>

      <v-textarea
          v-model="description"
          :clearable="true"
          label="Your description!"
          no-resize
          :style="{ marginLeft: '20px', marginRight: '20px' }">
      </v-textarea>

      <v-card v-if="!!errors" class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-danger">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-card-actions>
      <v-btn @click="previousStep">Previous step</v-btn>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>

  <v-card v-if="step === 4">

    <v-card-title>
      <span class="headline">Step 4: List for sale or auction! (optional)</span>
    </v-card-title>
    <v-container>

      <v-checkbox v-model="saleCheckbox" label="Sale"></v-checkbox>
      <v-checkbox v-model="auctionCheckbox" label="Auction"></v-checkbox>

      <v-text-field
          v-if="saleCheckbox"
          v-model="price"
          color="primary"
          prepend-inner-icon="mdi-currency-eur"
          label="Price"
          variant="underlined"
          :rules="numberRuleInteger"
      ></v-text-field>

      <v-text-field
          v-if="saleCheckbox"
          class="mt-2"
          v-model="quantity"
          color="primary"
          prepend-inner-icon="mdi-numeric"
          label="Quantity"
          variant="underlined"
          :rules="numberRuleInteger"
      ></v-text-field>

      <v-text-field
          v-if="auctionCheckbox"
          v-model="name"
          color="primary"
          prepend-inner-icon="mdi-format-title"
          label="Name your auction!"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-if="auctionCheckbox"
          class="mt-2"
          :readonly="true"
          v-model="startDate"
          color="primary"
          label="When will it start?"
          variant="underlined"
          prepend-inner-icon="mdi-calendar-arrow-right"
          @click:prepend-inner="$refs.datePicker.openMenu()"
      ></v-text-field>

      <v-text-field
          v-if="auctionCheckbox"
          class="mt-2"
          :readonly="true"
          v-model="endDate"
          color="primary"
          label="When will it end?"
          variant="underlined"
          prepend-inner-icon="mdi-calendar-arrow-left"
          @click:prepend-inner="$refs.datePicker1.openMenu()"
      ></v-text-field>

      <v-text-field
          v-if="auctionCheckbox"
          class="mt-2"
          v-model="startBid"
          color="primary"
          prepend-inner-icon="mdi-currency-eur"
          label="Starting price"
          variant="underlined"
          :rules="numberRuleInteger"
      ></v-text-field>

      <v-card v-if="!!errors" class="mb-12 mt-3" color="surface-variant" variant="tonal">
        <v-card-text
            class="text-medium-emphasis text-danger">
          <span v-html="errors"></span>
        </v-card-text>
      </v-card>

    </v-container>

    <v-card-actions>
      <v-btn @click="previousStep">Previous step</v-btn>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>

  <v-card v-if="step === 5">

    <v-card-title>
      <span class="headline">Summary</span>
    </v-card-title>
    <v-container>
      <SummaryStepPreview
          :title="title"
          :imageUrl="imageUrl"
          :artist="artist"
          :description="description"
          :forSale="saleCheckbox"
          :forAuction="auctionCheckbox"
      ></SummaryStepPreview>
    </v-container>

    <v-card-actions>
      <v-btn @click="previousStep">Previous step</v-btn>
      <v-btn @click="post">Post it</v-btn>
    </v-card-actions>

  </v-card>

  <VueDatePicker
      ref="datePicker"
      v-model="rawStartDate"
      :teleport-center="true"
      :dark="true"
      class="picker"
      format="dd-MM-yyyy"
  ></VueDatePicker>

  <VueDatePicker
      ref="datePicker1"
      v-model="rawEndDate"
      :teleport-center="true"
      :dark="true"
      class="picker"
      format="dd-MM-yyyy"
  ></VueDatePicker>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import SummaryStepPreview from "@/components/SummaryStepPreview.vue";
import axios from 'axios';
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "AddPostForm",
  components: { VueDatePicker, SummaryStepPreview },
  data () {
    return {
      numberRuleInteger: [
        v => !!v || 'Field is required',
        v => /^\d+(\.\d+)?$/.test(v) || 'Please write a valid number.'
      ],
      step: 1,
      title: null,
      artist: null,
      filename: null,
      selectedFile: null,
      imageUrl: null,
      uploading: false,
      description: null,
      saleCheckbox: false,
      auctionCheckbox: false,
      posting: false,
      artworkId: null,
      types: [],
      genres: [],
      type: null,
      genre: null,
      errors: null,
      price: null,
      quantity: null,
      name: null,
      startDate: null,
      rawStartDate: null,
      endDate: null,
      rawEndDate: null,
      startBid: null,
    }
  },
  mounted() {
    this.getTypes();
    this.getGenres();
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    typeNames() {
      return this.types.map(type => type.name);
    },
    genreNames() {
      return this.genres.map(genre => genre.name);
    },
    formattedStartDate() {
      if (!this.rawStartDate) return null;
      const date = new Date(this.rawStartDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    formattedEndDate() {
      if (!this.rawEndDate) return null;
      const date = new Date(this.rawEndDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  watch: {
    saleCheckbox(newVal) {
      if (newVal) {
        this.auctionCheckbox = false;
      }
    },
    auctionCheckbox(newVal) {
      if (newVal) {
        this.saleCheckbox = false;
      }
    },
    rawStartDate() {
      this.startDate = this.formattedStartDate;
    },
    startDate(newValue) {
      const [datePart, timePart] = newValue.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes, seconds] = timePart.split(':');

      this.rawStartDate = new Date(year, month - 1, day, hours, minutes, seconds);
    },
    rawEndDate() {
      this.endDate = this.formattedEndDate;
    },
    endDate(newValue) {
      const [datePart, timePart] = newValue.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes, seconds] = timePart.split(':');

      this.rawEndDate = new Date(year, month - 1, day, hours, minutes, seconds);
    }
  },
  methods: {
    nextStep () {
      if (this.step === 1) {
        if (this.title && this.artist && this.type && this.genre) {
          this.step += 1;
          this.errors = null;
        } else {
          this.errors = 'Please fill out all fields';
        }
        return;
      }

      if (this.step === 2) {
        if (this.filename) {
          this.step += 1;
          this.errors = null;
        } else {
          this.errors = 'Please upload an image';
        }
        return;
      }

      if (this.step === 3) {
        if (this.description) {
          this.step += 1;
          this.errors = null;
        } else {
          this.errors = 'Please add a description';
        }
        return;
      }

      if (this.step === 4) {

        this.errors = '';

        if (this.saleCheckbox) {
          if (this.price === null) {
            this.errors += 'Please write a valid number for price, using a comma as a decimal separator. ';
          } else {
            this.price = parseFloat(this.price);
            if (!this.isFloat(parseFloat(this.price))) {
              this.errors += 'Please write a valid number for price, using a comma as a decimal separator. ';
            } else if (this.price < 0.0) {
              this.errors += 'Please write a valid number for price, using a comma as a decimal separator. ';
            }
          }
          if (this.quantity === null) {
            this.errors += 'Please write a valid number for quantity. ';
          } else {
            this.quantity = parseInt(this.quantity);
            if (!this.isNumber(this.quantity)) {
              this.errors += 'Please write a valid number for quantity. ';
            } else if (this.quantity < 0) {
              this.errors += 'Please write a valid number for quantity. ';
            }
          }
        }

        if (this.auctionCheckbox) {
          if (this.startBid === null) {
            this.errors += 'Please write a valid number for starting bid, using a comma as a decimal separator. ';
          } else {
            this.startBid = parseFloat(this.startBid);
            if (!this.isFloat(this.startBid)) {
              this.errors += 'Please write a valid number for starting bid, using a comma as a decimal separator. ';
            } else {
              if (this.startBid < 0.0) {
                this.errors += 'Please write a valid number for starting bid, using a comma as a decimal separator. ';
              }
            }
          }
          if (this.startDate === null) {
            this.errors += 'Please write a valid date for start date. ';
          }
          if (this.endDate === null) {
            this.errors += 'Please write a valid date for end date. ';
          }
          if (this.name === null) {
            this.errors += 'Please write a name for auction. ';
          }
        }

        if (this.errors === '') {
          this.step += 1;
        }
      }
    },
    previousStep () {
      if (this.step !== 1) {
        this.step -= 1;
        this.errors = null;
      }
    },
    isFloat(value) {
      return typeof value === 'number' && !Number.isNaN(value);
    },
    isNumber(value) {
      return typeof value === 'number' && !Number.isNaN(value);
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
        this.imageUrl = imageUrl;
      } else {
        this.selectedFile = null;
        this.imageUrl = null;
      }
    },
    async uploadFile() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        try {
          this.uploading = true;
          const response = await axios.post('/artworks/images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + this.isAuthenticated
            },
          });

          if (response.status === 200) {
            this.filename = response.data.filename;
            console.log('File uploaded successfully.');
          } else {
            console.error('Error uploading file.');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        } finally {
          this.uploading = false;
        }
      }
    },
    async post() {
      try {
        this.posting = true;

        const response = await axios.post('/artworks/', {
          title: this.title,
          artist: this.artist,
          type: this.type,
          genre: this.genre,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        if (response.status === 200) {
          this.artworkId = response.data.id;
        }

        const responsePost = await axios.post('/posts/', {
          artwork_id: this.artworkId,
          description: this.description,
          image_url: this.filename
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        if (responsePost.status === 200) {
          console.log('Success');
        }

        console.log(this.auctionCheckbox)
        console.log(this.saleCheckbox)

        if (this.auctionCheckbox) {
          const responseAuction = await axios.post('/auctions', {
            artwork_id: this.artworkId,
            name: this.name,
            start_date: this.startDate,
            end_date: this.endDate,
            start_bid: this.startBid,
          }, {
            headers: {
              'Authorization': 'Bearer ' + this.isAuthenticated
            },
          });

          if (responseAuction.status === 200) {
            console.log('Success');
          }
        }
        if (this.saleCheckbox) {
          const responseSale = await axios.post('/sales', {
            artwork_id: this.artworkId,
            price: this.price,
            quantity: this.quantity,
          }, {
            headers: {
              'Authorization': 'Bearer ' + this.isAuthenticated
            },
          });

          if (responseSale.status === 200) {
            console.log('Success');
          }
        }
      } catch (error) {
        this.posting = false;
        console.error(error);
      } finally {
        this.posting = false;
        this.$router.push({ name: 'Home' });
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
  }
}
</script>

<style scoped>
.uploaded-image {
  max-width: 600px;
  max-height: 600px;
}

.picker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>