import {range} from 'd3-array'

import {newTable} from '../../giraffe/src'

const size = 200000
const tags = ['a', 'b', 'c', 'd', 'e']
const pointsPerUnit = 1000

const xs = range(0, size / pointsPerUnit, 1 / pointsPerUnit)

const xCol = []
const yCol = []
const tagCol = []

for (let i = 0; i < tags.length; i++) {
  const tag = tags[i]
  const phaseShift = i

  for (const x of xs) {
    xCol.push(x)
    yCol.push(Math.sin(x + phaseShift))
    tagCol.push(tag)
  }
}

export const SIN = newTable(size * tags.length)
  .addColumn('x', 'number', xCol)
  .addColumn('y', 'number', yCol)
  .addColumn('tag', 'string', tagCol)
