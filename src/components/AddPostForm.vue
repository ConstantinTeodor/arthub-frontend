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

    </v-container>

    <v-card-actions>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>

  <v-card v-if="step === 2">

    <v-card-title>
      <span class="headline">Step 2: Create your post!</span>
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

    </v-container>

    <v-card-actions>
      <v-btn @click="nextStep">Next step</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: "AddPostForm",
  data () {
    return {
      step: 1,
      title: null,
      artist: null,
    }
  },
  methods: {
    nextStep () {
      if (this.step !== 5) {
        this.step += 1;
      }
    }
  }
}
</script>

<style scoped>

</style>