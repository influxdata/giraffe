import {TextMetrics} from '../types'
import {STATIC_LEGEND_COLUMN_CLASSNAME} from '../constants'

const addPaddingToSampleText = (text: string): string => {
  if (typeof text !== 'string') {
    return text
  }

  const skinnyCharacters = ['-', '1', '|', 'i', 'l', 'I', 't']
  let sample = text

  for (let index = 0; index < text.length; index += 1) {
    const char = text.charAt(index)
    if (skinnyCharacters.includes(char)) {
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

interface StaticLegendTextMetrics {
  headerTextMetrics: TextMetrics
  sampleTextMetrics: TextMetrics
}

export const getStaticLegendTexMetrics = (): StaticLegendTextMetrics => {
  const sampleHeader = document.querySelector(
    `.${STATIC_LEGEND_COLUMN_CLASSNAME}-header`
  ) as HTMLElement

  const sampleValue = document.querySelector(
    `.${STATIC_LEGEND_COLUMN_CLASSNAME}-value`
  ) as HTMLElement

  const headerTextMetrics: TextMetrics = {height: 0, width: 0}
  const sampleTextMetrics: TextMetrics = {height: 0, width: 0}

  if (sampleHeader) {
    headerTextMetrics.height = sampleHeader.offsetHeight
    headerTextMetrics.width = sampleHeader.offsetWidth
  }

  if (sampleValue) {
    sampleTextMetrics.height = sampleValue.offsetHeight
    sampleTextMetrics.width = sampleValue.offsetWidth
  }

  return {
    headerTextMetrics,
    sampleTextMetrics,
  }
}
