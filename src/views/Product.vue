<template>
  <div>
    <h1>{{ product.name }}</h1>
    <div>
      <a :href="product.url">View current offer</a>
    </div>
    <div>Last update: {{ date(cur) }}</div>
    <div>
      <h4>Previous updates:</h4>
      <ul>
        <li v-for="offer in pastOffers" :key="offer.id">
          <label>
            <input
              type="radio"
              name="prevOffer"
              :value="offer"
              v-model="prev"
            />
            {{ date(offer) }}
          </label>
        </li>
      </ul>
    </div>
    <div class="diff-container">
      <table class="diff-table">
        <tbody>
          <tr
            v-for="(line, i) in diff"
            :key="i"
            :class="{
              'diff-line-has-changes':
                line.wordDiffs.some(d => d.added) ||
                line.wordDiffs.some(d => d.removed),
            }"
          >
            <td class="diff-prev">
              <span v-for="(phrase, i) in line.wordDiffs" :key="i">
                <span
                  v-if="!phrase.added"
                  :class="{'diff-chunk-removed': phrase.removed}"
                  >{{ phrase.value }}</span
                >
              </span>
            </td>
            <td class="diff-cur">
              <span v-for="(phrase, i) in line.wordDiffs" :key="i">
                <span
                  v-if="!phrase.removed"
                  :class="{'diff-chunk-added': phrase.added}"
                  >{{ phrase.value }}</span
                >
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const Diff = require('diff')

export default {
  name: 'Product',
  components: {},
  data() {
    return {
      prev: {summary: '', footnotes: ''},
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
    diff() {
      const lines = []
      const lineDiffs = Diff.diffLines(this.prev.footnotes, this.cur.footnotes)
      lineDiffs.forEach(diff => {
        if (!diff.added && !diff.removed) {
          const values = diff.value.split('\n')
          for (let i = 0; i < diff.count; i++) {
            lines.push({
              prev: values[i],
              cur: values[i],
            })
          }
        } else if (diff.removed) {
          lines.push({prev: diff.value})
        } else if (diff.added) {
          if (lines.length > 0) {
            const lastLine = lines[lines.length - 1]
            if (lastLine.added) {
              lines.push({cur: diff.value})
            } else {
              lastLine.cur = diff.value
            }
          } else {
            lines.push({prev: '', cur: diff.value})
          }
        }
      })

      const wordDiffs = []
      lines.forEach(line => {
        line.wordDiffs = Diff.diffWords(line.prev, line.cur)
      })
      return lines
    },
  },
  methods: {
    date(offer) {
      return moment(offer.timestamp * 1000).format('YYYY-MM-DD')
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
.diff-table td {
  width: 50%;
  vertical-align: top;
}
.diff-table .diff-line-has-changes .diff-prev {
  background: rgb(255, 196, 193);
}
.diff-table .diff-line-has-changes .diff-cur {
  background: rgb(181, 239, 219);
}
.diff-table .diff-chunk-removed {
  background: rgb(255, 137, 131);
}
.diff-table .diff-chunk-added {
  background: rgb(107, 223, 184);
}
</style>
