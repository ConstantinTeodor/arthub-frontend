<template>
  <v-card
      v-if="postData"
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

      <v-list-item-title> {{ postData.data.username }} </v-list-item-title>
      <v-list-item-subtitle> {{ postData.data.posted_at }} </v-list-item-subtitle>

      <template v-slot:append>
        <v-menu v-if="postData.data.myPost">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title @click="redirectEdit">Edit</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>

    <v-card-text :style="{ fontSize: '18px' }">
      {{ postData.data.description }}
    </v-card-text>

    <v-chip
        v-if="postData.data.sale !== null"
        class="ml-4 mr-2"
        color="pink"
        :label="true"
        text-color="white"
    >
      <v-icon :start="true" icon="mdi-tag"></v-icon>
      For sale
    </v-chip>

    <v-chip
        v-if="postData.data.auction !== null"
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
        {{ postData.data.artwork_artist }}
      </v-chip>

      <v-chip
          color="white"
          :label="true"
          text-color="white"
          :style="{ width: '50%', borderRadius: '0px' }"
      >
        <v-icon :start="true" icon="mdi-alpha-t-box-outline"></v-icon>
        {{ postData.data.artwork_title }}
      </v-chip>
    </v-card>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon v-if="iLiked" @click="like" class="me-1" color="pink" icon="mdi-heart"></v-icon>
            <v-icon v-else @click="like" class="me-1" icon="mdi-heart-outline"></v-icon>

            <span class="subheading me-2"> {{ postData.data.no_likes }} </span>
            <span class="me-1">|</span>
            <v-icon @click="overlay = !overlay" class="me-1" icon="mdi-comment-outline"></v-icon>
            <v-overlay v-model="overlay">
              <div class="d-flex justify-content-center align-items-center vw-100 vh-100">
                <v-card width="600" height="1000">
                  <template v-slot:append>
                    <v-btn icon="mdi-close" @click="overlay = !overlay">
                    </v-btn>
                  </template>
                  <v-container class="overflow-y-scroll" :style="{ height: '680px' }">
                    <div v-for="comment in postData.data.comments" :key="comment.id">
                      <comment-section :commentData="comment" @refreshPage="handleRefresh"></comment-section>
                    </div>
                  </v-container>
                  <v-container class="position-absolute bottom-0">
                    <v-divider></v-divider>
                    <v-textarea
                        v-model="commentData"
                        :clearable="true"
                        label="Write a comment!"
                        no-resize>
                    </v-textarea>
                    <v-btn variant="tonal" @click="comment" color="white" :style="{ width: '100%' }">Comment</v-btn>
                  </v-container>
                </v-card>
              </div>
            </v-overlay>
            <span class="subheading"> {{ postData.data.no_comments }} </span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';
import CommentSection from "@/components/CommentSection.vue";

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "PostCard",
  props: {
    id: {
      required: true,
    },
  },
  components: {
    CommentSection,
  },
  data() {
    return {
      imageUrl: '',
      postData: null,
      overlay: false,
      commentData: '',
      iLiked: false,
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchData();
    this.fetchImage();
    this.liked();
  },
  methods: {
    async fetchData() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/posts/' + this.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.postData = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async fetchImage() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get(`/artworks/images/` + this.id, {
          responseType: 'arraybuffer',
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.imageUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    async like() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/posts/like', {
          'post_id': 2,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        await this.fetchData();
        this.iLiked = !this.iLiked;
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    async comment() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        await axios.post('/posts/comment', {
          'post_id': 2,
          'comment': this.commentData,
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        await this.fetchData();
        this.commentData = '';
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    async liked() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get(`/posts/liked/` + this.id, {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });
        this.iLiked = response.data.likedPost;
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },
    handleRefresh() {
      this.fetchData();
    },
    redirectEdit() {
      this.$router.push({ name: 'EditPost', params: { id: parseInt(this.id) } });
    },
  },
}
</script>

<style scoped>

</style>