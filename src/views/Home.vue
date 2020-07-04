<template>
  <div class="home">
    <h1>
      Offers
    </h1>
    <div v-if="products.length === 0">Loading...</div>
    <div v-else>
      <input type="text" v-model="search" placeholder="Filter by name" />
      <table class="table is-striped">
        <thead>
          <tr>
            <th>Card / Offer</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.name"
            :class="{
              expired: recentOffer(product).footnotes.length == 0,
            }"
          >
            <td class="left">
              <router-link :to="product.slug">
                {{ product.name }}
              </router-link>
            </td>
            <td>{{ recentOffer(product).date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      search: '',
    }
  },
  computed: {
    products() {
      return this.$store.state.products.filter(p => p.offers.length > 0)
    },
    filteredProducts() {
      return this.products.filter(p =>
        p.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
  methods: {
    recentOffer(product) {
      return product.offers[0]
    },
  },
}
</script>

<style>
.home {
  text-align: center;
  display: flex;
  flex-direction: column;
}
.home .table {
  margin: auto;
}
.home .table td {
  vertical-align: top;
}
.home .table td.left {
  text-align: left;
  max-width: 320px;
}
.expired,
.expired * {
  color: lightgrey;
}
</style>
