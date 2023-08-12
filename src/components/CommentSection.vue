<template>
  <v-card
      class="mt-3"
      theme="dark"
  >

    <v-card-text v-if="!editEnabled" :style="{ fontSize: '18px' }">
      {{ commentData.comment }}
    </v-card-text>

    <v-card-text v-else>
      <v-text-field
          v-model="newComment"
          :append-icon="'mdi-send'"
          :clearable="true"
          label="Edit comment"
          @keydown.enter="edit"
          @click:append="edit">
      </v-text-field>
    </v-card-text>

    <v-alert
        v-if="deleteMessage"
        type="warning"
        :prominent="true"
        border="top"
        variant="outlined"
    >
      Are you sure you want to delete this comment?
      <template v-slot:append>
        <v-icon class="mt-2" @click="deleteComment">mdi-check</v-icon>
        <v-icon class="mt-2 ml-2" @click="deleteMessage = !deleteMessage">mdi-close</v-icon>
      </template>
    </v-alert>

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
            <v-icon v-if="commentData.myComment" @click="deleteMessage = !deleteMessage" class="me-1" color="white" icon="mdi-delete"></v-icon>
            <v-icon v-if="commentData.myComment" @click="editEnabled = !editEnabled" class="me-1" color="white" icon="mdi-pencil"></v-icon>
            <v-icon v-if="iLiked" @click="like" class="me-1" color="pink" icon="mdi-heart"></v-icon>
            <v-icon v-else @click="like" class="me-1" icon="mdi-heart-outline"></v-icon>
            <span class="subheading me-2"> {{ commentData.likes }} </span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "CommentSection",
  props: {
    commentData: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      iLiked: false,
      editEnabled: false,
      deleteMessage: false,
      newComment: '',
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.liked();
    this.newComment = this.commentData.comment;
  },
  methods: {
    async like() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/posts/comment/like', {
          'comment_id': this.commentData.id,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.iLiked = !this.iLiked;
        this.$emit('refreshPage');
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    async liked() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get(`/posts/comment/liked/` + this.commentData.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        this.iLiked = response.data.likedComment;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async edit() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/posts/comment/edit', {
          'comment_id': this.commentData.id,
          'comment': this.newComment,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.editEnabled = !this.editEnabled;
        this.$emit('refreshPage');
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    async deleteComment() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.delete(`/posts/comment/` + this.commentData.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        this.$emit('refreshPage');
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
  }
}
</script>

<style scoped>

</style>