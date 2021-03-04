describe('testing test', () => {
  it('should make snapshot of gauge', () => {
    cy.visitTest('Gauge', 'Gauge')

    cy.snapshotComponent('gauge-test-1')
  })
})
