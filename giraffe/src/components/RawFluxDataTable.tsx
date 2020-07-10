// Libraries
import React, {FunctionComponent, useState} from 'react'
import memoizeOne from 'memoize-one'
import {RawFluxDataGrid} from './RawFluxDataGrid'

// Utils
import {parseFiles} from '../utils/rawFluxDataTable'
import {DapperScrollbars} from './DapperScrollbars'

// Types
import {RawFluxDataTableLayerConfig} from '../types'

interface Props {
  config: RawFluxDataTableLayerConfig
  // files: string[]
  // width: number
  // height: number
  // disableVerticalScrolling?: boolean
}

interface State {
  scrollLeft: number
  scrollTop: number
}

const parseFilesMemoized = memoizeOne(parseFiles)

export const RawFluxDataTable: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState<State>({
    scrollLeft: 0,
    scrollTop: 0,
  })

  const onScrollbarsScroll = event => {
    const {scrollTop, scrollLeft} = event

    setState({scrollLeft, scrollTop})
  }

  const {
    config: {width, height, files, disableVerticalScrolling},
  } = props
  const {scrollTop, scrollLeft} = state
  const {data, maxColumnCount} = parseFilesMemoized(files)

  const tableWidth = width
  const tableHeight = height

  return (
    <div className="raw-flux-data-table" data-testid="raw-data-table">
      <DapperScrollbars
        style={{
          overflowY: 'hidden',
          width: tableWidth,
          height: tableHeight,
        }}
        autoHide={false}
        scrollTop={scrollTop}
        scrollLeft={scrollLeft}
        testID="rawdata-table--scrollbar"
        onScroll={onScrollbarsScroll}
        noScrollY={disableVerticalScrolling}
      >
        <RawFluxDataGrid
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          width={tableWidth}
          height={tableHeight}
          maxColumnCount={maxColumnCount}
          data={data}
          key={files[0]}
        />
      </DapperScrollbars>
    </div>
  )
}

/*
// .raw-flux-data-table > .fancy-scroll--container,
// .raw-flux-data-table--cell {
//   border: ($ix-border / 2) solid $g2-kevlar;
// }

.raw-flux-data-table--cell {
  // font-family: $cf-code-font;
  // font-size: 12px;
  // z-index: 1;
  // position: absolute;
  // top: 0;
  // left: 0;

  .raw-flux-data-table--cell-bg {
    // background: $g0-obsidian;
    // border: 2px solid $g0-obsidian;
    // position: absolute;
    // padding: 5px;
    // border-radius: 2px;
    // width: calc(100% - 10px);
    // min-width: 100%;
    // min-height: 100%;
    // text-overflow:  ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
    // user-select: text;
    // cursor: text;
  }

  &:hover {
    // z-index: 2;

    // .raw-flux-data-table--cell-bg {
    //   border: 2px solid $c-pool;
    //   background: $g5-pepper;
    //   width: auto;
    // }
  }
}
*/
