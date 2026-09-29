import {drawCircle} from './drawShapes'

const mockContext = () =>
  (({
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  } as unknown) as CanvasRenderingContext2D)

describe('drawCircle', () => {
  test('fills an arc centered on the point', () => {
    const ctx = mockContext()

    drawCircle(ctx, 10, 20, 6)

    expect(ctx.beginPath).toHaveBeenCalledTimes(1)
    expect(ctx.arc).toHaveBeenCalledWith(10, 20, 3, 0, 2 * Math.PI)
    expect(ctx.fill).toHaveBeenCalledTimes(1)
  })

  test('does not rely on stroking a zero-length line', () => {
    // Chromium 153+ prunes zero-length path segments, so a moveTo/lineTo
    // to the same point with round line caps no longer renders anything.
    const ctx = mockContext()

    drawCircle(ctx, 10, 20)

    expect(ctx.moveTo).not.toHaveBeenCalled()
    expect(ctx.lineTo).not.toHaveBeenCalled()
    expect(ctx.stroke).not.toHaveBeenCalled()
  })
})
