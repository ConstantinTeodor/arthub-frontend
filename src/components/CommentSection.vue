<template>
  <v-card
      class="mt-3"
      theme="dark"
  >

    <v-card-text :style="{ fontSize: '18px' }">
      {{ commentData.comment }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
              color="grey-darken-3"
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
        </template>

        <v-list-item-title> {{ commentData.username }} </v-list-item-title>

        <v-list-item-subtitle> {{ commentData.posted_at }} </v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-heart"></v-icon>
            <span class="subheading me-2">256</span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CommentSection",
  props: {
    commentData: {
      type: Object,
      required: false,
    },
  },
}
</script>

<style scoped>

</style>