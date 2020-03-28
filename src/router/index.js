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
    path: '/:product',
    name: 'Product',
    component: () => import('../views/Product.vue'),
    beforeEnter: async (to, from, next) => {
      if ($store.state.products.length === 0) {
        await $store.dispatch('init')
      }
      if ($store.state.products.find(p => p.slug === to.params.product)) {
        next()
      } else {
        next({name: 'Home'})
      }
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
