<template>
  <div class="home">
    <h1>
      Offers
    </h1>
    <span v-if="products.length === 0">Loading...</span>
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

<style>
.home {
  text-align: center;
}
.home h1 {
  margin: 10px;
}
.home ul {
  margin: 5px;
  padding: 0;
}
.home li {
  list-style: none;
}
</style>
