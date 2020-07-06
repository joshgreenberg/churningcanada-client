import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
  },
  mutations: {
    setRecentOffers(state, data) {
      state.products = data
    },
    setOffers(state, {slug, data}) {
      state.products.find(p => p.slug === slug).offers = data
    },
  },
  actions: {
    async loadRecentOffers({commit}) {
      await api.get('/offers').then(({data}) => {
        data.forEach(product => {
          if (product.url.match(/^REFERRAL_URL_/)) {
            const slug = product.slug.replace(/-referral$/, '')
            product.url = `${process.env.VUE_APP_SERVER_URL}/r/${slug}`
          }
        })
        commit('setRecentOffers', data)
      })
    },
    async loadOffers({commit}, slug) {
      await api.get(`/offers/${slug}`).then(({data}) => {
        commit('setOffers', {slug, data})
      })
    },
  },
})
