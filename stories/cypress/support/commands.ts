import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { Options as ImageSnapshotOptions } from 'cypress-image-snapshot'

addMatchImageSnapshotCommand()

// DOM node getters
export const getByTestID = (
  dataTest: string,
  options?: Partial<
    Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow
  >
): Cypress.Chainable => {
  return cy.get(`[data-testid="${dataTest}"]`, options)
}

export const getByTestIDSubStr = (dataTest: string): Cypress.Chainable => {
  return cy.get(`[data-testid*="${dataTest}"]`)
}

export const getByInputName = (name: string): Cypress.Chainable => {
  return cy.get(`input[name=${name}]`)
}

export const getByInputValue = (value: string): Cypress.Chainable => {
  return cy.get(`input[value='${value}']`)
}

export const getByTitle = (name: string): Cypress.Chainable => {
  return cy.get(`[title="${name}"]`)
}

/**
 * name is tab group name, storiname is tab name.
 */
export const visitTest = (name: string, storyname: string) => {
  /** format string to stories url format */
  const f = (str: string) =>
    str
      .replace(/ /g, '-')
      .replace(/:/g, '')
      .toLowerCase()
  cy.visit(`${f(name)}--${f(storyname)}`)
}

// todo: replace waitings with reasonable checks(of iframe)
/**
 * check snapshot of component with existing
 */
export const snapshotComponent = (
  snapshotName: string,
  options: ImageSnapshotOptions = {}
) => {
  // cy.get("iframe").its("0.contentDocument").should('exist')
  // .its('body').should('not.be.undefined')
  // .its(`p[content*='placeholder for']`).contains

  // enter full screen component
  cy.wait(1_000)
  // todo: better selector for zoom button
  cy.get('.css-pvky73 > span > button').click()

  cy.wait(1_000)
  cy.matchImageSnapshot(snapshotName, options)

  // exit full screen component
  cy.get('.css-pvky73 > span > button').click()
  cy.wait(1_000)
}

export const inputKnobs: {
  (label: string, value: string): void
  (label: string, value: string, type: 'select'): void
} = (label: string, value: number | string, type: 'range' | 'select' | 'number' | 'text' = 'text') => {
  const escapeSpaces = (str: string) => str.replace(/ /, '\\ ')
  const selector = `#${escapeSpaces(label)}, [name='${label}']`;
  switch (type) {
    case 'text':
      const valueStr = typeof value === 'number' ? value.toString() : value
      cy.get(selector)
        .clear({ force: true })
        .type(valueStr, { force: true })
      break
    case 'select':
      cy.get(selector)
        .select(value as string)
      break
    case 'range':
      throw new Error(`Input knobs of type ${type} not implemented`)
      // todo: input - range
      cy.get(`[name='${escapeSpaces(label)}']`)
      // .then(x => {
      //   x.first().trigger("change", {value})
      // })
      // .invoke('val', value)
      // .invoke('attr', 'value', value)
      // .trigger('input', { force: true, data: value })
      // .trigger('change', { force: true, value })
      // .invoke('mouseup')
      // .trigger('blur')
      // .type(100)
      // .trigger('mousedown', { which: 1 })
      // .trigger('mousemove', { clientX: 0, clientY: 100 })
      // .trigger('mouseup', {force: true})
      cy.wait(1000)
      break
    default:
      throw new Error(`Input knobs of type ${type} not implemented`)
  }
}

/* eslint-disable */

// getters
Cypress.Commands.add('getByTestID', getByTestID)
Cypress.Commands.add('getByInputName', getByInputName)
Cypress.Commands.add('getByInputValue', getByInputValue)
Cypress.Commands.add('getByTitle', getByTitle)
Cypress.Commands.add('getByTestIDSubStr', getByTestIDSubStr)

// storybook helpers
Cypress.Commands.add('visitTest', visitTest)
Cypress.Commands.add('snapshotComponent', snapshotComponent)
Cypress.Commands.add('inputKnobs', inputKnobs)

/* eslint-enable */
