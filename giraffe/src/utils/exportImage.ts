import mergeImages from 'merge-images'

export const exportImage = async (
  layerCanvas: HTMLCanvasElement,
  axesCanvas: HTMLCanvasElement,
  margins: {left?: number; top?: number} = {}
) => {
  const layerPng = layerCanvas.toDataURL()
  const axesPng = axesCanvas.toDataURL()

  let leftMargin = axesCanvas.width - layerCanvas.width
  if (margins.left) {
    leftMargin = margins.left
  }

  let topMargin = axesCanvas.height - layerCanvas.height
  if (margins.top) {
    topMargin = margins.top
  }

  // returns a base64 representation of the graph as a png
  return await mergeImages([
    axesPng,
    {src: layerPng, x: leftMargin, y: topMargin},
  ])
}
