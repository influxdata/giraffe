export const escapeCommas = (str: string): string => {
  console.log(str)
  return str.includes(',') ? `"${str.replace(/,/g, '\\,')}"` : str
}
