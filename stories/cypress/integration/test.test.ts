describe('testing test', () => {
  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')

    cy.inputKnobs('Decimal Places', 2)

    cy.snapshotComponent('gauge-test-1')
  })
})
