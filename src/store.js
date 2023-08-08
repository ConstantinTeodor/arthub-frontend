import { createStore } from 'vuex';

export default createStore({
    state: {
        token: localStorage.getItem('token') || null,
        expires: localStorage.getItem('expires') || null,
    },
    mutations: {
        setToken(state, token) {
            const ninetyDaysInMilliseconds = 90 * 24 * 60 * 60 * 1000;

            state.token = token;
            state.expires = Date.now() + ninetyDaysInMilliseconds;
            localStorage.setItem('token', token);
            localStorage.setItem('expires', Date.now() + ninetyDaysInMilliseconds);
        },
        clearToken(state) {
            state.token = null;
            state.expires = null;
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
        },
    },
    actions: {
    },
    getters: {
        isAuthenticated: (state) => {
            if (!state.token || Date.now() > state.expires) {
                return null;
            }
            return state.token;
        },
    },
});