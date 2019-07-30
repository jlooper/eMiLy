import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import poetry from '~/assets/original-poems.json';
import newPoetry from '~/assets/created-poems.json';

Vue.use(Vuex);

const state = {
    poem: null,
    newPoem: null,
    moodPoem: null,
    selfiePoem: null,
};

const mutations = {
    displayPoem: (state, randomPoem) => {
        state.poem = randomPoem;
    },
    displayNewPoem: (state, randomPoem) => {
        state.newPoem = randomPoem;
    },
    displayMoodPoem: (state, randomPoem) => {
        state.moodPoem = randomPoem;
    },
    displaySelfiePoem: (state, randomPoem) => {
        state.selfiePoem = randomPoem;
    },
    clearPoem: state => {
        state.poem = '';
    },
    clearMoodPoem: state => {
        state.moodPoem = '';
    },
    clearSelfiePoem: state => {
        state.selfiePoem = '';
    },
};

const actions = {
    getPoem({ commit }) {
        let randomPoem = Math.floor(Math.random() * 300);
        let poemObject = poetry[randomPoem];
        let parsedPoem = JSON.stringify(poemObject.text);
        let selectedPoem = parsedPoem.split(',').join('\n');
        commit('displayPoem', selectedPoem);
    },
    getMoodPoem({ commit }, payload) {
        for (var i = 0; i < poetry.length; i++) {
            //todo, randomize this as there are many possible matches
            if (poetry[i].sentiment.toFixed(1) == parseFloat(payload).toFixed(1)) {
                console.log(poetry[i].sentiment, parseFloat(payload));
                let parsedPoem = JSON.stringify(poetry[i].text);
                let selectedPoem = parsedPoem.split(',').join('\n');
                commit('displayMoodPoem', selectedPoem);
                break;
            }
        }
    },
    getSelfiePoem({ commit }, payload) {
        for (var i = 0; i < poetry.length; i++) {
            //todo, randomize this as there are many possible matches
            if (poetry[i].sentiment.toFixed(1) == parseFloat(payload).toFixed(1)) {
                console.log(poetry[i].sentiment, parseFloat(payload));
                let parsedPoem = JSON.stringify(poetry[i].text);
                let selectedPoem = parsedPoem.split(',').join('\n');
                commit('displaySelfiePoem', selectedPoem);
                break;
            }
        }
    },
    getNewPoem({ commit }) {
        let randomPoem = Math.floor(Math.random() * 10);
        let poemObject = newPoetry[randomPoem];
        let parsedPoem = JSON.stringify(poemObject.text);
        let selectedPoem = parsedPoem.split(',').join('\n');
        commit('displayNewPoem', selectedPoem);
    },
    clearPoem({ commit }) {
        commit('clearPoem');
    },
    clearMoodPoem({ commit }) {
        commit('clearMoodPoem');
    },
    clearSelfiePoem({ commit }) {
        commit('clearSelfiePoem');
    },
};

const storeConf = {
    state,
    mutations,
    actions,
};

export default new Vuex.Store(storeConf);
