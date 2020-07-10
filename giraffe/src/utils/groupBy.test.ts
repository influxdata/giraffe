import {groupBy} from './groupBy'

describe('groupBy', () => {
  it('handles empty arrays', () => {
    expect(groupBy([], val => val)).toEqual({})
  })

  it('handles groups that map to the same data point', () => {
    const data = [
      ['', '', '0', 'some data', 2.0],
      ['', '', '0', 'some more data', 3.14],
      ['', '', '0', 'even more data', 4.5],
      ['', '', '0', 'whoa so much data', 6],
    ]
    expect(groupBy(data, row => row[2])).toEqual({
      0: [...data],
    })
  })

  it('handles groups that map to different data points', () => {
    const data = [
      ['', '', '0', 'some data', 2.0],
      ['', '', '1', 'some more data', 3.14],
      ['', '', '2', 'even more data', 4.5],
      ['', '', '3', 'whoa so much data', 6],
    ]
    expect(groupBy(data, row => row[2])).toEqual({
      0: [data[0]],
      1: [data[1]],
      2: [data[2]],
      3: [data[3]],
    })
  })

  it('handles groups that map to both', () => {
    const data = [
      ['', '', '0', 'some data', 2.0],
      ['', '', '0', 'data', 56],
      ['', '', '1', 'some more data', 3.14],
      ['', '', '2', 'info', 4.5],
      ['', '', '2', 'even more data', 4.5],
      ['', '', '2', 'even more info', 0],
      ['', '', '3', 'whoa so much data', 6],
    ]
    expect(groupBy(data, row => row[2])).toEqual({
      0: [data[0], data[1]],
      1: [data[2]],
      2: [data[3], data[4], data[5]],
      3: [data[6]],
    })
  })
})
