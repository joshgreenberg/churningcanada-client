import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
  },
  mutations: {
    setProducts(state, data) {
      state.products = data
    },
  },
  actions: {
    async init({commit}) {
      await api.get('/').then(({data}) => {
        commit('setProducts', data)
      })
    },
  },
})
