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
          label="What type of artwork is this?"
          :items="typeNames"
          v-model="type"
      ></v-combobox>

      <v-combobox
          :clearable="true"
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

      <v-checkbox v-model="forSale" label="Sale"></v-checkbox>
      <v-checkbox v-model="forAuction" label="Auction"></v-checkbox>

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

    </v-container>

    <v-card-actions>
      <v-btn @click="previousStep">Previous step</v-btn>
      <v-btn @click="post">Post it</v-btn>
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
  name: "AddPostForm",
  data () {
    return {
      step: 1,
      title: null,
      artist: null,
      filename: null,
      selectedFile: null,
      imageUrl: null,
      uploading: false,
      description: null,
      forSale: false,
      forAuction: false,
      posting: false,
      artworkId: null,
      types: [],
      genres: [],
      type: null,
      genre: null,
      errors: null,
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
        this.step += 1;
      }
    },
    previousStep () {
      if (this.step !== 1) {
        this.step -= 1;
        this.errors = null;
      }
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
</style>