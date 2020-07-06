<template>
  <div class="home-page">
    <h1>
      Offers
    </h1>
    <div v-if="recentOffers.length === 0">Loading...</div>
    <div v-else>
      <input type="text" v-model="search" placeholder="Filter by name" />
      <table class="table is-striped">
        <thead :class="{asc: dir == 1, desc: dir == -1}">
          <tr>
            <th>
              <span
                class="th"
                :class="{sort: sort == 'name'}"
                @click="setSort('name')"
              >
                Card / Offer
              </span>
            </th>
            <th>
              <span
                class="th"
                :class="{sort: sort == 'date'}"
                @click="setSort('date')"
              >
                Last Updated
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <OfferRow
            v-for="product in filtered"
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
      sort: 'name',
      dir: 1,
    }
  },
  computed: {
    recentOffers() {
      return this.$store.state.products
    },
    filtered() {
      return this.recentOffers
        .filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => {
          const k = this.sort
          return a[k] > b[k] ? this.dir : a[k] < b[k] ? -this.dir : 0
        })
    },
  },
  methods: {
    setSort(key) {
      if (this.sort == key) {
        this.dir *= -1
      }
      this.sort = key
    },
  },
  created() {
    if (this.recentOffers.length == 0) {
      this.$store.dispatch('loadRecentOffers')
    }
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
  min-width: 8em;
}
.home-page .expired,
.home-page .expired * {
  color: lightgrey;
}

.home-page .th {
  cursor: pointer;
}
.home-page .th:after {
  display: inline-block;
  content: '';
  border-left: 0.5em solid transparent;
  border-right: 0.5em solid transparent;
}
.home-page .asc .th.sort:after {
  border-bottom: 0.8em solid #a17ac6;
}
.home-page .desc .th.sort:after {
  border-top: 0.8em solid #a17ac6;
}
</style>
