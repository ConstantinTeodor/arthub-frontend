<template>
  <v-card class="positioning-conv mt-4 overflow-y-scroll" width="30%" height="90%">
    <v-list density="compact">
      <v-list-subheader>Your conversations</v-list-subheader>

      <v-list-item
          class="mt-2"
          v-for="conversation in conversationDetails"
          :key="conversation.id"
          color="primary"
          @click="openConversation(conversation.id, conversation.with)"
      >

        <v-list-item-title>
          <v-avatar
              color="grey-darken-3"
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
          <span class="ml-2"> {{ conversation.name }} <br> </span>
          <span class="text-disabled"> Your conversation with {{ conversation.with }} </span>
        </v-list-item-title>
        <template v-slot:append>
          <v-badge
              v-if="conversation.unread_messages !== 0"
              :content="conversation.unread_messages"
              :inline="true"
              color="danger"
          >
          </v-badge>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <MessagesComponent
      class="positioning-messages"
      v-if="propId !== null"
      :conversationId="propId"
      :withProp="propWith"
  />
</template>

<script>
import MessagesComponent from "@/components/MessagesComponent.vue";
import { mapGetters } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "ConversationsComponent",
  components: {
    MessagesComponent
  },
  data() {
    return {
      conversationDetails: null,
      propId: null,
      propWith: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/conversations', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        })

        this.conversationDetails = response.data.data;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    openConversation(conversationId, withProp) {
      console.log(conversationId, withProp);
        this.propId = conversationId;
        this.propWith = withProp;
    }
  }
}
</script>

<style scoped>
.positioning-conv {
  margin-left: 5%;
}
.positioning-messages {
  position: absolute;
  right: 5%;
  top: 288px;
  width: 60%;
  height: calc(90% - 238px);
}
</style>