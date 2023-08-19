<template>
  <v-card
      class="mt-3"
      theme="dark"
      @click="redirectPage"
  >
    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
              color="grey-darken-3"
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
        </template>

        <v-list-item-title> {{ user.name }} </v-list-item-title>

        <v-list-item-subtitle v-if="user.middle_name !== null"> {{ user.first_name + ' ' + user.middle_name + ' ' + user.last_name }} </v-list-item-subtitle>
        <v-list-item-subtitle v-else> {{ user.first_name + ' ' + user.last_name }} </v-list-item-subtitle>


      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ClientSearch",
  props: {
    user: {
      required: true,
    },
  },
  methods: {
    redirectPage() {
      this.$emit('closeOverlay');
      this.$router.push({ name: 'Profile', params: { id: parseInt(this.user.id) }});
    }
  }
}
</script>

<style scoped>

</style>