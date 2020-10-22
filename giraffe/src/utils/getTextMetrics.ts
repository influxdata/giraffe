export interface TextMetrics {
  width: number
  height: number
}

export const getTextMetrics = (font: string, text: string): TextMetrics => {
  const div = document.createElement('div')
  const span = document.createElement('span')

  div.appendChild(span)

  // Translate offscreen
  div.setAttribute(
    'style',
    `font: ${font}; display: inline; position: fixed; transform: translate(-9999px, -9999px);`
  )

  document.body.appendChild(div)

  // Text with the same number of characters:
  //   when it includes a dash (negative number), it tends to be skinnier than
  //   a positive number because a dash is not as wide as a single digit (most of the time).
  //   Add padding when text has a dash by making dashes twice as wide.
  span.innerText =
    typeof text === 'string' && text.includes('-') ? `-${text}` : text

  const metrics = {
    width: span.offsetWidth,
    height: span.offsetHeight,
  }

  document.body.removeChild(div)

  return metrics
}
