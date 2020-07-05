<template>
  <div class="offer-page">
    <div v-if="!product">Loading...</div>
    <div class="header">
      <router-link :to="{name: 'Home'}" class="back">Back</router-link>
      <div v-if="product">
        <div class="center">
          <h1>{{ product.name }}</h1>
          <div>
            <a :href="product.url" target="_blank">View current offer</a>
          </div>
        </div>
        <div class="flex">
          <div>
            <div v-if="pastOffers.length">
              Previous update:
              <select v-model="prev">
                <option
                  v-for="offer in pastOffers"
                  :key="offer.id"
                  :value="offer"
                >
                  {{ offer.date }}
                </option>
              </select>
            </div>
          </div>
          <div>Recent update: {{ cur.date }}</div>
        </div>
      </div>
    </div>
    <div class="diff-container" v-if="product">
      <table class="diff-table">
        <tbody>
          <tr v-for="(line, i) in lines" :key="i">
            <td :class="{'diff-line-removed': line.some(l => l.removed)}">
              <span v-for="(chunk, j) in line" :key="j">
                <span
                  v-if="!chunk.added"
                  :class="{'diff-chunk-removed': chunk.removed}"
                >
                  {{ chunk.value }}
                </span>
              </span>
            </td>
            <td :class="{'diff-line-added': line.some(l => l.added)}">
              <span v-for="(chunk, j) in line" :key="j">
                <span
                  v-if="!chunk.removed"
                  :class="{'diff-chunk-added': chunk.added}"
                >
                  {{ chunk.value }}
                </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import diff from '@/lib/diff'

export default {
  name: 'Product',
  components: {},
  data() {
    return {
      prev: {footnotes: []},
    }
  },
  computed: {
    product() {
      return this.$store.state.products.find(
        p => p.slug === this.$route.params.slug
      )
    },
    cur() {
      return this.product.offers[0]
    },
    pastOffers() {
      return this.product.offers.slice(1)
    },
    lines() {
      const a = this.prev.footnotes
      const b = this.cur.footnotes
      return diff(a, b)
    },
  },
  created() {
    if (this.product.offers.length > 1) {
      this.prev = this.product.offers[1]
    }
  },
}
</script>

<style>
.offer-page .back {
  font-size: 1.2em;
  text-decoration: none;
  font-weight: 200;
  position: absolute;
}
.offer-page .back:before {
  content: '';
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #a17ac6;
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
  transform: rotate(45deg);
  font-size: 0.6em;
}
.offer-page .header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 20px 20px -20px black;
  padding: 20px;
}
@media screen and (max-width: 769px) {
  .offer-page .header {
    font-size: 0.8em;
    padding: 5px;
  }
  .offer-page .back {
    margin: 15px;
    font-size: 1.5em;
  }
}
.offer-page h1 {
  margin: 10px 0 0 0;
}
.offer-page .center {
  text-align: center;
  margin: 10px 0;
}
.offer-page .flex {
  display: flex;
  justify-content: space-around;
}
.offer-page .diff-container {
  margin: 20px 10px;
}
.offer-page .diff-table {
  width: 100%;
}
.offer-page .diff-table td {
  width: 50%;
  vertical-align: top;
}
.offer-page .diff-table .diff-line-removed {
  background: rgb(255, 196, 193);
}
.offer-page .diff-table .diff-line-added {
  background: rgb(181, 239, 219);
}
.offer-page .diff-table .diff-chunk-removed {
  background: rgb(255, 137, 131);
}
.offer-page .diff-table .diff-chunk-added {
  background: rgb(107, 223, 184);
}
</style>
