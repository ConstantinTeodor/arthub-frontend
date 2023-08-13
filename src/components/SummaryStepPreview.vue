<template>
  <v-card
      class="mx-auto mt-5"
      color="rgba(20, 20, 20, 1)"
      theme="dark"
      width="600"
  >
    <v-list-item class="mt-4">
      <template v-slot:prepend>
        <v-avatar
            color="grey-darken-3"
            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
        ></v-avatar>
      </template>

      <v-list-item-title> Some cool person </v-list-item-title>
      <v-list-item-subtitle> {{ formattedCurrentDate }} </v-list-item-subtitle>

      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
        </v-menu>
      </template>
    </v-list-item>

    <v-card-text :style="{ fontSize: '18px' }">
      {{ this.description }}
    </v-card-text>

    <v-chip
        v-if="forSale === true"
        class="ml-4 mr-2"
        color="pink"
        :label="true"
        text-color="white"
    >
      <v-icon :start="true" icon="mdi-tag"></v-icon>
      For sale
    </v-chip>

    <v-chip
        v-if="forAuction === true"
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
        height="450"
        v-if="imageUrl"
        :src="imageUrl"
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
        {{ this.artist }}
      </v-chip>

      <v-chip
          color="white"
          :label="true"
          text-color="white"
          :style="{ width: '50%', borderRadius: '0px' }"
      >
        <v-icon :start="true" icon="mdi-alpha-t-box-outline"></v-icon>
        {{ this.title }}
      </v-chip>
    </v-card>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" color="pink" icon="mdi-heart"></v-icon>
            <span class="subheading me-2"> 213 </span>
            <span class="me-1">|</span>
            <v-icon class="me-1" icon="mdi-comment-outline"></v-icon>
            <span class="subheading"> 43 </span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SummaryStepPreview",
  props: {
    description: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      required: true,
    },
    forSale: {
      type: Boolean,
      required: true,
    },
    forAuction: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
    formattedCurrentDate() {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return this.currentDate.toLocaleString('en-US', options);
    },
  },
}
</script>

<style scoped>

</style>