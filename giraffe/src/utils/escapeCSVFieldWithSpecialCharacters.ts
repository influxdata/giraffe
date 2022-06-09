// escape the string containing commas and newlines by wrapping it in double quotes.
// See: https://stackoverflow.com/a/4617967
export const escapeCSVFieldWithSpecialCharacters = (str: string) => {
  if (str.includes(',') || str.includes('\n')) {
    return `"${str}"`
  } else {
    return str
  }
}
