import {getContents} from './TableCell'

describe('getContent() table cell tests', () => {
  const baseProperties = {
    decimalPlaces: {digits: 2, isEnforced: true},
    timeFormat: 'YYYY-MM-DD HH:mm:ss ZZ',
    colors: [],
    fieldOptions: [],
    tableOptions: {},
  }

  const noDecimals = {
    decimalPlaces: {digits: 0, isEnforced: false},
    timeFormat: 'YYYY-MM-DD HH:mm:ss ZZ',
    colors: [],
    fieldOptions: [],
    tableOptions: {},
  }

  const protoBaseProps = {
    timeFormatter: (time: string) => time,
    rowIndex: 1,
    columnIndex: 2,
    isVerticalTimeAxis: true,
    sortOptions: {field: null, direction: 'asc'},
    hoveredRowIndex: 0,
    hoveredColumnIndex: 0,
    isFirstColumnFixed: false,
    isTimeVisible: true,
    isScrolling: false,
    onClickFieldName: jest.fn(),
    onHover: jest.fn(),
    resolvedRenamableFields: [],
    key: 'test-key',
    parent: null,
    style: null,
  }

  const baseProps = {properties: baseProperties, ...protoBaseProps}
  const basePropsWithoutDecimals = {properties: noDecimals, ...protoBaseProps}

  it('should not format strings at all, just pass through', () => {
    const tableCellProps = {data: 'foo.local', dataType: 'string', ...baseProps}

    const result = getContents(tableCellProps)
    expect(result).toEqual('foo.local')
  })
  it('should format numbers correctly', () => {
    function testNumber(num, formatted, noDecimals = false) {
      let props = {data: `${num}`, dataType: 'double', ...baseProps}

      if (noDecimals) {
        props = {
          data: `${num}`,
          dataType: 'double',
          ...basePropsWithoutDecimals,
        }
      }
      const result = getContents(props)
      expect(result).toEqual(formatted)
    }

    testNumber('123454', '123,454.00')
    testNumber('123454', '123,454', true)
    testNumber('55', '55.00')
    testNumber('.8', '0.80')
    testNumber('1.8', '1.80')
    testNumber('.822', '0.82')
    testNumber('2244', '2,244.00')
    testNumber('2244', '2,244', true)
  })
  it('should just pass through an empty string', () => {
    const tableCellProps = {data: '', dataType: 'string', ...baseProps}

    const result = getContents(tableCellProps)
    expect(result).toEqual(tableCellProps.data)

    const tableCellProps2 = {data: '  ', dataType: 'string', ...baseProps}

    const result2 = getContents(tableCellProps2)
    expect(result2).toEqual(tableCellProps2.data)
  })
})
