export interface TextMetrics {
  width: number
  height: number
}

export const getTextMetrics = (font: string, text: string): TextMetrics => {
  const div = document.createElement('div')
  const span = document.createElement('span')
  const spanWithDash = document.createElement('span')

  div.appendChild(span)
  div.appendChild(spanWithDash)

  // Translate offscreen
  div.setAttribute(
    'style',
    `font: ${font}; display: inline; position: fixed; transform: translate(-9999px, -9999px);`
  )

  document.body.appendChild(div)

  span.innerText = text
  spanWithDash.innerText = '-'

  // Text with the same number of characters:
  //   when it includes a dash (negative number), it tends to be skinnier than
  //   a positive number because a dash is not as wide as a single digit (most of the time).
  //   Add padding when text has a dash by making dashes twice as wide.
  const widthPadding =
    typeof text === 'string' && text.includes('-')
      ? spanWithDash.offsetWidth
      : 0
  const metrics = {
    width: span.offsetWidth + widthPadding,
    height: span.offsetHeight,
  }

  document.body.removeChild(div)

  return metrics
}
