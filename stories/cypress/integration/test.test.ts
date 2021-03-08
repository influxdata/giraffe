describe('testing test', () => {
  it.only('should fix geo data', () => {
    cy.visitTest('Geo', 'Circle Markers')
    cy.inputKnobs('Fixed data', true, 'boolean')
  })

  it('should make snapsot of band chart', () => {
    cy.visitTest('Band Chart', 'Static: groupBy applied')
    cy.inputKnobs('Time Format', 'HH:mm', 'select')
  })

  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')

    cy.snapshotComponent('gauge-test-1')

    cy.inputKnobs('Decimal Places', 2, 'number')

    cy.snapshotComponent('gauge-test-2-decimal-places')

    cy.inputKnobs('Gauge Min', 20, 'number')

    cy.snapshotComponent('gauge-test-start-20')
  })
})
