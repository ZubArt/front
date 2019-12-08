import Vue from 'vue';
import Vuex from 'vuex';
import { VuexSaga } from 'vuex-coolstory';
import { rootSaga, modules } from '@/store/modules';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
  },
  mutations: {
  },
  actions: {
  },
  plugins: [
    VuexSaga({ sagas: [rootSaga] })
  ],
  modules: {
    ...modules
  },
});
