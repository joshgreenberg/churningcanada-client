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
        data.forEach(product => {
          if (product.url.match(/^REFERRAL_URL_/)) {
            const slug = product.slug.replace(/-referral$/, '')
            product.url = `${process.env.VUE_APP_SERVER_URL}/r/${slug}`
          }
        })
        commit('setProducts', data)
      })
    },
  },
})
