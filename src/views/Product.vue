<template>
  <div>
    <div v-if="!product">Loading...</div>
    <div class="header">
      <router-link :to="{name: 'Home'}" class="back">Back</router-link>
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
    <div class="diff-container">
      <table class="diff-table">
        <tbody>
          <tr
            v-for="(line, i) in lines"
            :key="i"
            :class="{
              'diff-line-has-changes': line.before !== line.after,
            }"
          >
            <td :class="{'diff-line-removed': line.before}">
              <span
                v-for="(chunk, j) in line.oldChunks"
                :key="j"
                :class="{'diff-chunk-removed': chunk.removed}"
              >
                {{ chunk.value }}
              </span>
            </td>
            <td :class="{'diff-line-added': line.after}">
              <span
                v-for="(chunk, j) in line.newChunks"
                :key="j"
                :class="{'diff-chunk-added': chunk.added}"
              >
                {{ chunk.value }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import patience from '@/../lib/patience'

const transpose = a => a[0].map((b, c) => a.map(r => r[c]))

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
        p => p.slug === this.$route.params.product
      )
    },
    cur() {
      return this.product.offers[0]
    },
    pastOffers() {
      return this.product.offers.slice(1)
    },
    lines() {
      if (!this.prev.footnotes.length) {
        return this.cur.footnotes.map(str => ({
          after: str,
          newChunks: [{count: 1, value: str}],
        }))
      }
      if (!this.cur.footnotes.length) {
        return this.prev.footnotes.map(str => ({
          before: str,
          oldChunks: [{count: 1, value: str}],
        }))
      }

      const lines = patience.align(
        this.prev.footnotes,
        this.cur.footnotes,
        /(?<=\.)\s+/g
      )

      const rejoinedLines = lines.map(([bef, aft]) => [
        bef.join(' ').trim(),
        aft.join(' ').trim(),
      ])

      const lineObjects = rejoinedLines
        .filter(l => l[0] || l[1])
        .map(([before, after]) => {
          const sentences = patience.sentencePairs(before, after)
          const chunks = sentences.map(sen => patience.wordDiff(...sen)).flat()
          return {
            before,
            after,
            oldChunks: chunks.filter(diff => !diff.added),
            newChunks: chunks.filter(diff => !diff.removed),
          }
        })

      return lineObjects
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
.back {
  margin-bottom: 10px;
  font-size: 1.2em;
  text-decoration: none;
  font-weight: 200;
}
.back:before {
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
.header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 20px 20px -20px black;
  padding: 20px;
}
h1 {
  margin: 10px 0 0 0;
}
.center {
  text-align: center;
  margin: 10px 0;
}
.flex {
  display: flex;
  justify-content: space-around;
}
.diff-container {
  margin: 20px 10px;
}
.diff-table {
  width: 100%;
}
.diff-table td {
  width: 50%;
  vertical-align: top;
}
.diff-table .diff-line-has-changes .diff-line-removed {
  background: rgb(255, 196, 193);
}
.diff-table .diff-line-has-changes .diff-line-added {
  background: rgb(181, 239, 219);
}
.diff-table .diff-chunk-removed {
  background: rgb(255, 137, 131);
}
.diff-table .diff-chunk-added {
  background: rgb(107, 223, 184);
}
</style>
