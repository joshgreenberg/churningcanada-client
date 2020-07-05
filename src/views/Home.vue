<template>
  <div class="home-page">
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
          <OfferRow
            v-for="product in filteredProducts"
            :key="product.slug"
            :product="product"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import OfferRow from '@/components/OfferRow'

export default {
  name: 'Home',
  components: {
    OfferRow,
  },
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
}
</script>

<style>
.home-page {
  text-align: center;
  display: flex;
  flex-direction: column;
}
.home-page .table {
  margin: auto;
  max-width: 30em;
}
.home-page .table thead {
  background-color: #e6efe9;
}
.home-page .table tbody tr:nth-child(even) {
  background-color: #f7fff7;
}
.home-page .table td {
  vertical-align: top;
}
.home-page .table td.left {
  text-align: left;
}
.home-page .table td.date {
  min-width: 7em;
}
.home-page .expired,
.home-page .expired * {
  color: lightgrey;
}
</style>
