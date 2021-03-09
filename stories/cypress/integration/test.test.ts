
describe('testing test', () => {
  it('should make Gauge snapshot', () => {
    cy.visitTest('Gauge', 'Gauge')
    cy.inputKnobs('Fixed data', true, 'boolean')
  })

  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')
    cy.inputKnobs('Fixed data', true, 'boolean')
    cy.inputKnobs('Gauge Lines', 12, 'number')
    cy.wait(4000)
    cy.inputKnobs('Ticks between lines', 3, 'number')

    cy.snapshotComponent('gauge-test-3-ticks-between-lines-12-gauge-lines')

    cy.inputKnobs('Gauge Min', 10, 'number')

    cy.inputKnobs('Prefix', 'haf ', 'text')
    cy.wait(2000)

    cy.snapshotComponent('gauge-test-Haf-prefix-10-gauge-min')
  })

  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')
    cy.inputKnobs('Fixed data', true, 'boolean')

    cy.inputKnobs('Ticks between lines', 3, 'number')

    cy.snapshotComponent('gauge-test-3-ticks-between-lines')
    cy.wait(2000)

    cy.inputKnobs('Gauge Max', 23, 'number')
    cy.inputKnobs('Suffix', 'HKS', 'text')
    cy.wait(2000)
    cy.inputKnobs('Suffix', 'halsper ', 'text')

    cy.snapshotComponent('gauge-test-suffix-prefix-type')


  })

  it('should make snapchot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')
    cy.inputKnobs('Fixed data', true, 'boolean')

    cy.inputKnobs('Decimal Places', 1, 'number')
    cy.wait(3000)

    cy.inputKnobs('Gauge Lines', 1, 'number')
    cy.inputKnobs('Ticks between lines', 39, 'number')

    cy.inputKnobs('TickPrefix', 'kdfakdhj', 'text')
    cy.snapshotComponent('gauge-test-tick-prefix')

    cy.inputKnobs('TickPrefix', ' ', 'text')
    cy.inputKnobs('TickSuffix', 'kdkdhj', 'text')
    cy.snapshotComponent('gaure-test-ticksSuffix')
  }
  )
})