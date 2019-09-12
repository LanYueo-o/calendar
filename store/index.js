import Vue from 'Vue';
import Vuex from 'Vuex';
import filter from './filter';

Vue.use(Vuex);

const store = () => new Vuex.Store({
    state: {

    },
    mutations: {

    },
    modules: {
        filter
    }
});

export default store;
