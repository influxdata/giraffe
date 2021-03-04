/* eslint @typescript-eslint/no-unused-vars: "off" */
import 'jest'

import {
  getByTestID,
  getByInputName,
  getByInputValue,
  getByTitle,
  getByTestIDSubStr,
  visitTest,
  snapshotComponent,
} from './support/commands'

declare global {
  namespace Cypress {
    interface Chainable {
      
      getByTestID: typeof getByTestID
      getByInputName: typeof getByInputName
      getByInputValue: typeof getByInputValue
      getByTitle: typeof getByTitle
      getByTestIDSubStr: typeof getByTestIDSubStr
      visitTest: typeof visitTest
      snapshotComponent: typeof snapshotComponent
    }
  }
}
