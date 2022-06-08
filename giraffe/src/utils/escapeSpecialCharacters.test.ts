import { escapeCSVFieldWithSpecialCharacters } from "./escapeCSVFieldWithSpecialCharacters";

describe('escapeSpecialCharacters', () => {
  it('should escape a string with commas', function() {
    const stringWithCommas = 'this is a string, with comma, and another one'

    expect(escapeCSVFieldWithSpecialCharacters(stringWithCommas)).toEqual(`"${stringWithCommas}"`)
  })

  it('should escape a string with newLines', function() {
    const stringWithNewline = `this is a string 
    with a newline
    and another one`

    expect(escapeCSVFieldWithSpecialCharacters(stringWithNewline)).toEqual(`"${stringWithNewline}"`)
  })

  it('should escape a string with both commas and newLines', function() {
    const stringWithNewlineAndComma = `this is a string 
    with a newline, a comma,
    and another newline and comma`

    expect(escapeCSVFieldWithSpecialCharacters(stringWithNewlineAndComma)).toEqual(`"${stringWithNewlineAndComma}"`)
  })

})