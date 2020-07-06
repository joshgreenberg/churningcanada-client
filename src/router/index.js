import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import api from '../api'

Vue.use(VueRouter)

import $store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:slug',
    name: 'Product',
    component: () => import('../views/Product.vue'),
    beforeEnter: async (to, from, next) => {
      const slug = to.params.slug
      if ($store.state.products.length == 0) {
        await $store.dispatch('loadRecentOffers')
      }
      if ($store.state.products.find(p => p.slug === slug)) {
        await $store.dispatch('loadOffers', slug)
        next()
      } else {
        next({name: 'Home'})
      }
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
