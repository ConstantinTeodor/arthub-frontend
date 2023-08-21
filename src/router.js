import { createRouter, createWebHistory } from 'vue-router';

// Import your components for routing here
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Register from './views/Register.vue';
import RegisterClient from "@/views/RegisterClient.vue";
import AddPost from "@/views/AddPost.vue";
import EditPost from "@/views/EditPost.vue";
import Profile from "@/views/Profile.vue";
import Marketplace from "@/views/Marketplace.vue";
import Checkout from "@/views/Checkout.vue";
import AuctionPage from "@/views/AuctionPage.vue";

const routes = [
    {
        path: '/login',
        name: 'LogIn',
        component: Login,
    },

    {
        path: '/',
        name: 'Home',
        component: Home,
    },

    {
        path: '/register',
        name: 'Register',
        component: Register,
    },

    {
        path: '/register-2',
        name: 'Register-Client',
        component: RegisterClient,
    },

    {
        path: '/addPost',
        name: 'AddPost',
        component: AddPost,
    },

    {
        path: '/editPost/:id',
        name: 'EditPost',
        component: EditPost,
    },

    {
        path: '/profile/:id',
        name: 'Profile',
        component: Profile,
    },

    {
        path: '/marketplace',
        name: 'Marketplace',
        component: Marketplace,
    },

    {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout,
    },

    {
        path: '/auction/:id',
        name: 'AuctionPage',
        component: AuctionPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
