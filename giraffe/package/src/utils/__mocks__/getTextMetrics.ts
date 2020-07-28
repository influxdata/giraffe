/*
  utils/getTextMetrics uses the DOM to measure the actual width and height of a string
  Since Jest does not have access to the DOM, we will fix the width and height to be some arbitrary numbers,
  so that our tests will run properly for consumers of getTextMetrics

  This is a mock using a fake font that will always have
  width equal to 1.2 times the length of the string
  heigth equal to 12
*/
export const getTextMetrics = (...args) => ({
  width: Math.floor(args[1].length * 1.2),
  height: 12,
})
