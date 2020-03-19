<template>
  <div class="home">
    <ul>
      <li v-for="product in products" :key="product.name">
        <router-link :to="product.slug">
          {{ product.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  computed: {
    products() {
      return this.$store.state.products
    },
  },
}
</script>
