<template>
  <v-app>
    <TopNavigationBar/>
    <v-main>
      <div v-for="id in ids" :key="id">
        <PostCard :id="id"/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import TopNavigationBar from "@/components/TopNavigationBar.vue";
import PostCard from "@/components/PostCard.vue";
import { mapGetters } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
export default {
  name: "HomePage",
  components: {
    TopNavigationBar,
    PostCard,
  },
  data() {
    return {
      ids: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchIds();
  },
  methods: {
    async fetchIds() {
      try {
        if (!this.isAuthenticated) {
          this.$router.push('/login');
        }
        const response = await axios.get('/posts/feed/getIds', {
          headers: {
            'Authorization': 'Bearer ' + this.isAuthenticated
          },
        });

        this.ids = response.data.feed;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
}
</script>

<style scoped>

</style>