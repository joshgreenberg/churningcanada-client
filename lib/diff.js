const Diff = require('diff')
import nw from './nw'

const transpose = a => a[0].map((b, c) => a.map(r => r[c]))

export const squash = (a, b) => {
  const chunks = Diff.diffArrays(a, b)
  const squashed = chunks.reduce((result, value, index, array) => {
    if (!value.added && !value.removed) {
      result.push([value.value, value.value])
    } else if (
      array[index + 1] &&
      value.count === array[index + 1].count &&
      value.removed &&
      array[index + 1].added
    ) {
      result.push([value.value, array[index + 1].value])
    }
    return result
  }, [])
  return squashed
}

export const combineSections = squashed => {
  return squashed.map(c => transpose(c)).flat()
}

export default (a, b) => {
  const aligned = nw(a, b)
  const squashedLines = aligned.map(line => squash(line.a, line.b))
  const shortestDiff = squashedLines.reduce((prev, next) =>
    prev.length > next.length ? next : prev
  )
  return combineSections(shortestDiff)
}
