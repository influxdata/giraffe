describe('testing test', () => {
  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')

    cy.snapshotComponent('gauge-test-1')

    cy.inputKnobs('Decimal Places', 2)

    cy.snapshotComponent('gauge-test-2-decimal-places')

    cy.inputKnobs('Gauge Min', 20)

    cy.snapshotComponent('gauge-test-start-20')
  })
})
