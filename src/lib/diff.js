const Diff = require('diff')

const align = (a, b) => {
  const same = []

  for (let i = 0; i < a.length; i++) {
    for (
      let j = same.length > 0 ? same[same.length - 1][1] || 0 : 0;
      j < b.length;
      j++
    ) {
      if (same.map(([x, y]) => y).includes(j)) {
        continue
      }
      if (a[i] == b[j]) {
        same.push([i, j])
        break
      }
    }
  }

  const lines = []
  let i = 0
  let j = 0
  for (let s = 0; s < same.length; s++) {
    const [x, y] = same[s]
    while (i < x || j < y) {
      const lineA = i < x ? a[i++] : null
      const lineB = j < y ? b[j++] : null
      lines.push([lineA, lineB])
    }
  }
  while (i < a.length || j < b.length) {
    const lineA = i < a.length ? a[i++] : null
    const lineB = j < b.length ? b[j++] : null
    lines.push([lineA, lineB])
  }

  return lines
}

const diff = ([a, b], token) => {
  const result = Diff.diffArrays(
    a ? a.split(token) : [],
    b ? b.split(token) : []
  )
  result.forEach(r => {
    r.value = r.value.join(token)
  })
  return result
}

const main = (a, b) => {
  const token = ' '
  const aligned = align(a, b)
  return aligned.map(pair => {
    return diff(pair, token)
  })
}

export default main
