<template>
  <v-parallax
      height="300"
      :src="getImagePath('background.png')"
  >
  </v-parallax>
  <v-card :style="{ paddingTop: '110px'}" class="color_class">
    <v-card-text>
      <v-card-title class="text-center">
        <h1>{{ name }}</h1>
      </v-card-title>
      <v-card-subtitle class="text-center">
        <h3>{{ username }}</h3>
      </v-card-subtitle>
    </v-card-text>
  </v-card>
  <v-img
      height="200"
      width="200"
      :src="getImagePath('profile_alt.jpeg')"
      class="rounded-circle profile-picture"
  ></v-img>
</template>

<script>
export default {
  name: "ProfileDetails",
  props: {
    name: {
      required: true,
    },
    username: {
      required: true,
    },
  },
  methods: {
    getImagePath(fileName) {
      return require(`@/assets/${fileName}`);
    },
  }
}
</script>

<style scoped>
.profile-picture {
  position: absolute;
  top: 260px;
  left: calc(50% - 100px);
  right: calc(50% - 100px);
}

.color_class {
  background-color: #212121;
}
</style>