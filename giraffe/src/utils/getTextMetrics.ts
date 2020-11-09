export interface TextMetrics {
  width: number
  height: number
}

const addPaddingToSampleText = (text: string): string => {
  if (typeof text !== 'string') {
    return text
  }

  let sample = text

  /* The following are considered skinny characters:
    -
    1
    |
    i
    l
    I
    !
  */

  for (let index = 0; index < text.length; index += 1) {
    const char = text.charAt(index)
    if (
      char === '-' ||
      char === '1' ||
      char === '|' ||
      char === 'i' ||
      char === 'l' ||
      char === 'I' ||
      char === '!'
    ) {
      sample += char
    }
  }
  return sample
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
  //   when it includes a skinny character (defined above), it tends to be skinnier than
  //   a positive number because the skinny character is not as wide as a single digit (most of the time).
  //   Add padding when text has a skinny character by making them twice as wide.
  span.innerText = addPaddingToSampleText(text)

  const metrics = {
    width: span.offsetWidth,
    height: span.offsetHeight,
  }

  document.body.removeChild(div)

  return metrics
}
