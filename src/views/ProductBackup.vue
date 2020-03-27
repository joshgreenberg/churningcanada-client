<template>
  <div>
    <div class="header">
      <h1>{{ product.name }}</h1>
      <div>
        <a :href="product.url">View current offer</a>
      </div>
      <div>Most recent update: {{ date(cur) }}</div>
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
    </div>
    <div class="diff-container">
      <table class="diff-table">
        <tbody>
          <tr
            v-for="(line, i) in diff"
            :key="i"
            :class="{
              'diff-line-has-changes': line.prev !== line.cur,
            }"
          >
            <td :class="{'diff-line-removed': line.prev}">
              <span v-for="(phrase, i) in line.prevDiffs" :key="i">
                <span
                  :class="{'diff-chunk-removed': phrase.removed && line.cur}"
                  >{{ phrase.value }}</span
                >
              </span>
            </td>
            <td :class="{'diff-line-added': line.cur}">
              <span v-for="(phrase, i) in line.curDiffs" :key="i">
                <span
                  :class="{'diff-chunk-added': phrase.added && line.prev}"
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
import patience from '@/../lib/patience'

// const squashTokens = [' ', ', ', '.']

// const squashDiffs = chunks => {
//   let pointer = 0
//   while (pointer < chunks.length) {
//     const chunk = chunks[pointer]
//     if (chunk.count === 1 && (chunk.added || chunk.removed)) {
//       let nextChunk = chunks[pointer + 1]
//       while (
//         (squashTokens.includes(nextChunk.value) &&
//           !nextChunk.removed &&
//           !nextChunk.added) ||
//         (chunk.added && nextChunk.added) ||
//         (chunk.removed && nextChunk.removed)
//       ) {
//         chunk.value += nextChunk.value
//         chunks.splice(pointer + 1, 1)
//         nextChunk = chunks[pointer + 1]
//         if (!nextChunk) break
//       }
//     }
//     pointer++
//   }
//   return chunks
// }

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
      if (!this.prev.footnotes) {
        return this.cur.footnotes.split('\n').map(str => ({
          cur: str,
          curDiffs: [{count: 1, value: str}],
        }))
      }
      if (!this.cur.footnotes) {
        return this.prev.footnotes.split('\n').map(str => ({
          prev: str,
          prevDiffs: [{count: 1, value: str}],
        }))
      }

      const lines = []
      const lineDiffs = Diff.diffLines(this.prev.footnotes, this.cur.footnotes)

      const expandedLineDiffs = lineDiffs.reduce((acc, cur) => {
        if (cur.count == 1) {
          acc.push(cur)
        } else {
          const values = cur.value.split('\n')
          values.forEach(value => {
            acc.push({
              count: 1,
              removed: cur.removed,
              added: cur.added,
              value,
            })
          })
        }
        return acc
      }, [])

      expandedLineDiffs.forEach(diff => {
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
            if (lastLine.cur) {
              lines.push({prev: '', cur: diff.value})
            } else {
              lastLine.cur = diff.value
            }
          } else {
            lines.push({prev: '', cur: diff.value})
          }
        }
      })

      const noEmptyLines = lines.filter(line => line.prev || line.cur)
      noEmptyLines.forEach(line => {
        if (!line.prev && !line.cur) return
        const wordDiffs = patience(line.prev || '', line.cur || '')

        const prevChunks = wordDiffs.filter(d => !d.added)
        const curChunks = wordDiffs.filter(d => !d.removed)

        line.prevDiffs = prevChunks
        line.curDiffs = curChunks
      })

      console.log(noEmptyLines)

      return noEmptyLines
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
.header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 20px 20px -20px black;
  padding: 20px;
}
h1 {
  margin: 0;
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
