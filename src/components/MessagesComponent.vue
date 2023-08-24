<template>
  <div>
    <div class="message-title">
      <v-card height="100%">
        <v-card-title class="mt-1">
          {{ withProp }}
        </v-card-title>
      </v-card>
    </div>
    <div class="message-container bg-custom overflow-y-scroll">
      <v-card
          v-for="message in messages"
          :key="message.id"
          width="40%"
          :class="message.isFromMe ? 'positioning-right' : 'positioning-left'"
          :prepend-icon="'mdi-chat-outline'"
      >
        <template v-slot:title>
          <div class="custom-title">{{ message.text }}</div>
        </template>

        <v-card-text>
          {{ message.created_at }}
        </v-card-text>
      </v-card>
    </div>
    <div class="message-form">
      <v-card height="100%" width="100%">
        <v-text-field
            class="mr-3"
            v-model="message"
            :append-icon="'mdi-send'"
            variant="filled"
            clear-icon="mdi-close-circle"
            :clearable="true"
            label="Type a message"
            type="text"
            @click:append="sendMessage"
            @keyup.enter="sendMessage"
        ></v-text-field>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "MessagesComponent",
  props: {
    conversationId: {
      required: true,
    },
    withProp: {
      required: true,
    }
  },
  data() {
    return {
      messages: null,
      message: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    conversationId() {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/messages/' + this.conversationId, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        })

        this.messages = response.data.data;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async sendMessage() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/messages', {
          message: this.message,
          conversation_id: this.conversationId,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          }
        })
        this.message = null;
        await this.fetchData();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
  }
}
</script>

<style scoped>
.bg-custom {
  background-color: rgba(20, 20, 20, 1);
}
.positioning-right {
  position: relative;
  left: 60%;
  border: 2px solid rgba(20, 20, 20, 1);
}
.positioning-left {
  border: 2px solid rgba(20, 20, 20, 1);
}
.message-container {
  height: calc(100% - 110px);
}
.message-title {
  height: 55px;
  width: 100%;
}
.message-form {
  width: 100%;
  height: 55px;
}
.custom-title {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}
</style>