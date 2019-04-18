export interface TextMetrics {
  charWidth: number
  charHeight: number
  charSpacing: number
}

export const getTextMetrics = (fontSpec: string): TextMetrics => {
  const div = document.createElement('div')

  div.setAttribute(
    'style',
    `font: ${fontSpec}; display: inline; position: fixed; left: 0; right: 0`
  )

  const span = document.createElement('span')

  div.appendChild(span)

  // https://stackoverflow.com/questions/3949422/which-letter-of-the-english-alphabet-takes-up-most-pixels
  span.appendChild(document.createTextNode('W'))

  document.body.appendChild(div)

  const metrics = {
    charWidth: span.offsetWidth,
    charHeight: span.offsetHeight,
    charSpacing: 1,
  }

  document.body.removeChild(div)

  return metrics
}
