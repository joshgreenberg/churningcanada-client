// Trying another aglorithm
// Works well on simple data, but very slow as set grows
// Patience works well enough, just stick with it for now

export default (a, b) => {
  // Scores
  const score_match = 1
  const score_mismatch = -1
  const score_gap = -1
  const score_gap_ext = -2 // TODO?

  const grid = [] // a.length + 1 by b.length + 1
  const arrows = []

  // fill left column
  for (let i = 0; i < a.length + 1; i++) {
    grid[i] = [i * score_gap]

    // prep arrows for entire grid
    arrows[i] = [[[i - 1, 0]]]
    for (let j = 1; j < b.length + 1; j++) {
      arrows[i][j] = []
      arrows[0][j] = [[0, j - 1]]
    }
    arrows[0][0] = []
  }
  // fill top row
  for (let j = 0; j < b.length + 1; j++) {
    grid[0][j] = j * score_gap
  }

  // fill the rest
  for (let i = 1; i < a.length + 1; i++) {
    for (let j = 1; j < b.length + 1; j++) {
      const top = grid[i][j - 1]
      const left = grid[i - 1][j]
      const diag = grid[i - 1][j - 1]

      const prevMove_gap = arrows[i - 1][j - 1].find(
        ([ii, jj]) =>
          (ii === i - 1 && jj === j - 2) || (ii === i - 2 && jj === j - 1)
      )

      const top_score = top + (prevMove_gap ? score_gap_ext : score_gap)
      const left_score = left + (prevMove_gap ? score_gap_ext : score_gap)
      const diag_score =
        a[i - 1] === b[j - 1] ? diag + score_match : diag + score_mismatch

      const new_score = Math.max(top_score, left_score, diag_score)

      grid[i][j] = new_score

      if (new_score === top_score) {
        arrows[i][j].push([i, j - 1])
      }
      if (new_score === left_score) {
        arrows[i][j].push([i - 1, j])
      }
      if (new_score === diag_score) {
        arrows[i][j].push([i - 1, j - 1])
      }
    }
  }

  const branch = {a: [], b: []}
  let i = a.length
  let j = b.length
  while (i > 0 || j > 0) {
    const [ii, jj] = arrows[i][j][0]
    if (i - ii === 1) {
      branch.a.push(a[ii])
      i--
    } else if (i === ii) {
      branch.a.push('')
    }
    if (j - jj === 1) {
      branch.b.push(b[jj])
      j--
    } else if (j === jj) {
      branch.b.push('')
    }
  }

  const trace = (i, j, branch, arrow) => {
    const [ii, jj] = arrow
    if (i - ii === 1) {
      branch.a.push(a[ii])
      i--
    } else if (i === ii) {
      branch.a.push('')
    }
    if (j - jj === 1) {
      branch.b.push(b[jj])
      j--
    } else if (j === jj) {
      branch.b.push('')
    }
    return [i, j]
  }

  const traverse = (i, j, branch = {a: [], b: []}) => {
    const theseArrows = arrows[i][j]
    if (theseArrows.length === 1) {
      const [ii, jj] = trace(i, j, branch, theseArrows[0])
      return traverse(ii, jj, branch)
    } else if (theseArrows.length > 1) {
      branch.sub = []
      theseArrows.forEach(arrow => {
        const newBranch = {a: [], b: []}
        branch.sub.push(newBranch)
        const [ii, jj] = trace(i, j, newBranch, arrow)
        return traverse(ii, jj, newBranch)
      })
    }
    return branch
  }

  const combine = branch => {
    if (branch.sub) {
      return branch.sub.map(newBranch => {
        return combine({
          a: branch.a.concat(newBranch.a),
          b: branch.b.concat(newBranch.b),
          sub: newBranch.sub,
        }).flat()
      })
    }
    return [branch]
  }

  const result = combine(traverse(a.length, b.length)).flat()
  result.forEach(branch => {
    branch.a.reverse()
    branch.b.reverse()
    delete branch.sub
  })
  return result
}
