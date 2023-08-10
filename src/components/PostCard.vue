<template>
  <v-card
      class="mx-auto mt-5"
      color="rgba(20, 20, 20, 1)"
      theme="dark"
      max-width="400"
  >
    <v-list-item class="mt-4">
      <template v-slot:prepend>
        <v-avatar
            color="grey-darken-3"
            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
        ></v-avatar>
      </template>

      <v-list-item-title>Evan You</v-list-item-title>
      <v-list-item-subtitle>Vue Creator</v-list-item-subtitle>
    </v-list-item>

    <v-card-text :style="{ fontSize: '18px' }">
      O descriere foarte emotionanta de-ti da si o lacrima
    </v-card-text>

    <v-chip
        class="ml-4 mr-2"
        color="pink"
        :label="true"
        text-color="white"
    >
      <v-icon :start="true" icon="mdi-tag"></v-icon>
      For sale
    </v-chip>

    <v-chip
        class="ml-2"
        color="orange"
        :label="true"
        text-color="white"
    >
      <v-icon :start="true" icon="mdi-gavel"></v-icon>
      For auction
    </v-chip>

    <v-img
        class="ml-4 mr-4 mt-3"
        :cover="true"
        height="250"
        src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card
        :style="{ width: 'auto' }"
        class="d-flex justify-center ml-4 mr-4 mb-2"
        :label="true"
        color="transparent"
    >
      <v-chip
          color="white"
          :label="true"
          text-color="white"
          :style="{ width: '50%', borderRadius: '0px' }"
      >
        <v-icon :start="true" icon="mdi-alpha-a-box-outline"></v-icon>
        Marcel Popescu
      </v-chip>

      <v-chip
          color="white"
          :label="true"
          text-color="white"
          :style="{ width: '50%', borderRadius: '0px' }"
      >
        <v-icon :start="true" icon="mdi-alpha-t-box-outline"></v-icon>
        Placinta cu mere
      </v-chip>
    </v-card>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-heart-outline"></v-icon>
            <span class="subheading me-2">256</span>
            <span class="me-1">|</span>
            <v-icon class="me-1" icon="mdi-comment-outline"></v-icon>
            <span class="subheading">45</span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "PostCard"
}
</script>

<style scoped>

</style>