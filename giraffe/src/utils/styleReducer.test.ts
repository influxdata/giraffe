import {styleReducer} from './styleReducer'

describe('styleReducer', () => {
  it('handles empty classes object', () => {
    const classes = {}
    const current = 'my-module-special-class'
    expect(styleReducer(classes, '', current)).toEqual(current)
  })

  it('handles empty string for current class', () => {
    const classes = {
      'my-module-base-class': 'scO5eArm2gBGQAF2U2n6D',
    }
    const accumulator = 'my-module-other-class'
    const current = ''

    expect(styleReducer({}, '', current)).toEqual('')
    expect(styleReducer(classes, '', current)).toEqual('')
    expect(styleReducer(classes, accumulator, current)).toEqual(
      `${accumulator} ${current}`
    )
  })

  it('returns the current style if classes module does not have the current style', () => {
    const classes = {
      'my-module-base-class': 'scO5eArm2gBGQAF2U2n6D',
    }
    const current = 'my-module-special-class'
    expect(styleReducer(classes, '', current)).toEqual(current)
  })

  it('uses the accumulator as the starting point for the current style', () => {
    const classes = {
      'my-module-base-class': 'scO5eArm2gBGQAF2U2n6D',
    }
    const accumulator = 'my-module-other-class'
    const current = 'my-module-special-class'

    expect(styleReducer(classes, accumulator, current)).toEqual(
      `${accumulator} ${current}`
    )
    expect(styleReducer(classes, '', current)).toEqual(`${current}`)
    expect(styleReducer(classes, 'start-with-this-class', current)).toEqual(
      `start-with-this-class ${current}`
    )
  })

  it('returns the class from the classes module when it exists', () => {
    const classes = {
      'my-module-base-class': 'scO5eArm2gBGQAF2U2n6D',
    }
    const accumulator = 'my-module-other-class'
    const current = 'my-module-base-class'
    expect(styleReducer(classes, accumulator, current)).toEqual(
      `${accumulator} ${classes[current]}`
    )
  })
})
