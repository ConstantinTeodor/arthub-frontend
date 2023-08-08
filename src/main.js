import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import 'bootstrap/dist/css/bootstrap.css';
import store from './store';
import router from './router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


loadFonts();

const app = createApp(App);
app.use(vuetify);
app.use(store);
app.use(router);
app.use(VueDatePicker);
app.mount('#app');
