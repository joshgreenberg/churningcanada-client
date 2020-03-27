const Diff = require('diff')

const getUnique = (el, i, arr) => arr.filter(e => e === el).length === 1

const longestIncreasingSubsequence = indices => {
  const stacks = []
  const pointers = []

  while (indices.length > 0) {
    const n = indices.shift()
    const stack = stacks.find(s => s[s.length - 1] > n)
    if (stack) {
      stack.push(n)
    } else {
      stacks.push([n])
    }
    const i = stacks.findIndex(s => s[s.length - 1] === n) - 1
    if (i >= 0) {
      const prevStack = stacks[i]
      const top = prevStack[prevStack.length - 1]
      pointers[n] = top
    }
  }

  const sequence = []
  const lastStack = stacks[stacks.length - 1]
  if (lastStack) {
    let k = lastStack[lastStack.length - 1]
    while (k !== undefined) {
      sequence.push(k)
      k = pointers[k]
    }
  }

  return sequence.reverse()
}

const transpose = a => a[0].map((b, c) => a.map(r => r[c]))

const groupRuns = input => {
  return input.reduce((r, n) => {
    const last = r[r.length - 1]
    if (!last || last[last.length - 1] !== n - 1) {
      r.push([])
    }
    r[r.length - 1].push(n)
    return r
  }, [])
}

const groupParallelRuns = (a, b) => {
  const output = []
  let i = 0
  while (i < a.length) {
    const runA = [a[i]]
    const runB = [b[i]]
    while (a[i] === a[i + 1] - 1 && b[i] === b[i + 1] - 1) {
      runA.push(a[i + 1])
      runB.push(b[i + 1])
      i++
    }
    output.push([runA, runB])
    i++
  }
  return output
}

const pairs = (before, after) => {
  const oldChunks = before
  const newChunks = after

  const oldUnique = oldChunks.filter(getUnique)
  const newUnique = newChunks.filter(getUnique)

  const indices = newUnique.map(e => oldUnique.indexOf(e)).filter(i => i >= 0)
  const sequence = longestIncreasingSubsequence(indices)

  const oldPinnedIndices = sequence.map(i => oldChunks.indexOf(oldUnique[i]))
  const newPinnedIndices = sequence.map(i => newChunks.indexOf(oldUnique[i]))

  const parallelRuns = groupParallelRuns(oldPinnedIndices, newPinnedIndices)

  const pairs = []
  let optr = 0
  let nptr = 0
  let run = 0
  while (optr < oldChunks.length && nptr < newChunks.length) {
    const pair = [[], []]
    if (
      parallelRuns[run] &&
      parallelRuns[run][0].includes(optr) &&
      parallelRuns[run][1].includes(nptr)
    ) {
      // same and pinned
      while (parallelRuns[run][0].includes(optr)) {
        pair[0].push(oldChunks[optr++])
      }
      while (parallelRuns[run][1].includes(nptr)) {
        pair[1].push(newChunks[nptr++])
      }
      run++
    } else {
      // different or unpinned
      while (!oldPinnedIndices.includes(optr) && optr < oldChunks.length) {
        pair[0].push(oldChunks[optr++])
      }
      while (!newPinnedIndices.includes(nptr) && nptr < newChunks.length) {
        pair[1].push(newChunks[nptr++])
      }
    }
    pairs.push(pair)
  }

  return pairs
}

const addMetadata = (chunks, token) =>
  chunks.map((c, i) => c.split(token).map(s => ({i, text: s})))

// aligns two arrays of LINES by common unique runs of SENTENCES
// should work for any inputs
const align = (before, after, token) => {
  const oldMeta = addMetadata(before, token).flat()
  const newMeta = addMetadata(after, token).flat()

  const aligned = pairs(
    oldMeta.map(l => l.text),
    newMeta.map(l => l.text)
  )

  let optr = 0
  let nptr = 0

  for (let i = 0; i < aligned.length; i++) {
    const [bef, aft] = aligned[i]
    for (let b = 0; b < bef.length; b++) {
      bef[b] = oldMeta[optr]
      optr++
    }
    for (let a = 0; a < aft.length; a++) {
      aft[a] = newMeta[nptr]
      nptr++
    }
  }

  const fullAligned = []
  optr = 0
  nptr = 0
  let i = 0
  while (i < aligned.length && (oldMeta.length || newMeta.length)) {
    const [bef, aft] = aligned[i]
    if (bef.length || aft.length) {
      const pair = [[], []]
      if (bef.length) {
        const b = bef[0].i
        while (bef.length && bef[0].i === b) {
          pair[0].push(bef.shift())
        }
      }
      if (aft.length) {
        const a = aft[0].i
        while (aft.length && aft[0].i === a) {
          pair[1].push(aft.shift())
        }
      }
      fullAligned.push(pair)
    } else {
      i++
    }
  }

  const crushed = []
  while (fullAligned.length) {
    const pair = fullAligned.shift()
    const b = pair[0][0] ? pair[0][0].i : 0
    const a = pair[1][0] ? pair[1][0].i : 0
    while (
      fullAligned[0] &&
      fullAligned[0][0].every(c => c.i === b) &&
      fullAligned[0][1].every(c => c.i === a)
    ) {
      const [bef, aft] = fullAligned.shift()
      pair[0].push(...bef)
      pair[1].push(...aft)
    }
    crushed.push(pair)
  }

  const unmeta = crushed.map(([bef, aft]) => [
    bef.map(e => e.text),
    aft.map(e => e.text),
  ])

  return unmeta
}

const sentencePairs = (before, after) => {
  const regex = /(?<=\.)\s+/g
  return pairs(
    before.split(regex).map(w => w.trim()),
    after.split(regex).map(w => w.trim())
  ).map(([b, a]) => [b.join(' '), a.join(' ')])
}

const wordDiff = (before, after) => {
  const token = ' '
  const wordPairs = pairs(before.split(token), after.split(token))
  const diff = wordPairs
    .map(pair => {
      return Diff.diffArrays(...pair)
    })
    .flat()
  return diff.map(line => {
    return {
      ...line,
      value: line.value.join(token),
    }
  })
}

export default {
  pairs,
  align,
  sentencePairs,
  wordDiff,
}
