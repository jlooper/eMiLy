import Vue from 'nativescript-vue';
import store from './store';
import Home from './components/Home';
Vue.prototype.$store = store;
new Vue({
    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home,
    },
}).$start();
