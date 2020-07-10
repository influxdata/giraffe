// Libraries
import React, {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  UIEvent,
  CSSProperties,
  ReactNode,
} from 'react'
import classnames from 'classnames'
import Scrollbar from 'react-scrollbars-custom'
import {ScrollState} from 'react-scrollbars-custom/dist/types/types'

// Styles
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  'cf-dapper-scrollbars--wrapper': {
    margin: {
      right: 0,
      bottom: 0,
    },
    right: 0,
    bottom: 0,
    color: '#bec2cc',
  },
  'cf-dapper-scrollbars--content': {
    display: 'block',
  },
  'cf-dapper-scrollbars--track-x': {
    'border-radius': '6px',
    position: 'absolute',
    'background-color': 'rgba(15, 14, 21, 0.4)',
    'user-select': 'none',
    overflow: 'hidden',
    transition: 'opacity 0.25s ease',
    height: '6px',
    width: 'calc(100% - 3px)',
    bottom: '3px',
    left: '3px',
  },
  'cf-dapper-scrollbars--track-y': {
    'border-radius': '6px',
    position: 'absolute',
    'background-color': 'rgba(15, 14, 21, 0.4)',
    'user-select': 'none',
    overflow: 'hidden',
    transition: 'opacity 0.25s ease',
    width: '6px',
    height: 'calc(100% - 6px)',
    right: '3px',
    top: '3px',
  },
  'cf-dapper-scrollbars--thumb-x': {
    'border-radius': '3px',
    height: '6px',
  },
  'cf-dapper-scrollbars--thumb-y': {
    'border-radius': '3px',
    width: '6px',
  },
  'cf-dapper-scrollbars--autohide': {
    '& .cf-dapper-scrollbars--track-x': {
      opacity: 0,
    },
    '& .cf-dapper-scrollbars--track-y': {
      opacity: 0,
    },
    '&:hover': {
      '& .cf-dapper-scrollbars--track-x': {
        opacity: 1,
      },
      '& .cf-dapper-scrollbars--track-y': {
        opacity: 1,
      },
    },
  },
})

// Types
export interface StandardFunctionProps {
  /** Unique identifier for getting an element */
  id?: string
  /** Useful for setting common attributes like width or height */
  style?: CSSProperties
  /** ID for Integration Tests */
  testID?: string
  /** Children */
  children?: ReactNode
  /** Useful for overriding styles of the component and its constituent elements */
  className?: string
}
enum InfluxColors {
  // Greys
  Obsidian = '#0f0e15',
  Raven = '#181820',
  Kevlar = '#202028',
  Castle = '#292933',
  Onyx = '#31313d',
  Pepper = '#383846',
  Smoke = '#434453',
  Graphite = '#545667',
  Storm = '#676978',
  Mountain = '#757888',
  Wolf = '#8e91a1',
  Sidewalk = '#999dab',
  Forge = '#a4a8b6',
  Mist = '#bec2cc',
  Chromium = '#c6cad3',
  Platinum = '#d4d7dd',
  Pearl = '#e7e8eb',
  Whisper = '#eeeff2',
  Cloud = '#f6f6f8',
  Ghost = '#fafafc',
  White = '#ffffff',
  // Blues
  Abyss = '#120653',
  Sapphire = '#0b3a8d',
  Ocean = '#066fc5',
  Pool = '#00a3ff',
  Laser = '#00C9FF',
  Hydrogen = '#6BDFFF',
  Neutrino = '#BEF0FF',
  Yeti = '#F0FCFF',
  // Purples
  Shadow = '#2b007e',
  Void = '#5c10a0',
  Amethyst = '#8e1fc3',
  Star = '#be2ee4',
  Comet = '#ce58eb',
  Potassium = '#dd84f1',
  Moonstone = '#ebadf8',
  Twilight = '#fad9ff',
  // Greens
  Gypsy = '#003e34',
  Emerald = '#006f49',
  Viridian = '#009f5f',
  Rainforest = '#34bb55',
  Honeydew = '#67d74e',
  Krypton = '#9bf445',
  Wasabi = '#c6f98e',
  Mint = '#f3ffd6',
  // Yellows
  Oak = '#3F241F',
  Topaz = '#E85B1C',
  Tiger = '#F48D38',
  Pineapple = '#FFB94A',
  Thunder = '#FFD255',
  Sulfur = '#FFE480',
  Daisy = '#FFF6B8',
  Banana = '#FFFDDE',
  // Reds
  Basalt = '#2F1F29',
  Ruby = '#BF3D5E',
  Fire = '#DC4E58',
  Curacao = '#F95F53',
  Dreamsicle = '#FF8564',
  Tungsten = '#FFB6A0',
  Marmelade = '#FFDCCF',
  Flan = '#FFF7F4',
  // Brand Colors
  Chartreuse = '#D6F622',
  DeepPurple = '#13002D',
  Magenta = '#BF2FE5',
  Galaxy = '#9394FF',
  Pulsar = '#513CC6',
}

// react-scrollbars-custom uses a highly unusual type
// to presumably handle touch and mouse events simultaneously
// type FusionScrollEvent = UIEvent<HTMLDivElement> & ScrollState
// Using this custom type makes typescript happy
// and exposes enough typing to properly interface
// with the onScroll and onUpdate props

type UIEventHandler = (event: UIEvent<HTMLDivElement>) => void
type ScrollStateEventHandler = (
  scrollValues: ScrollState,
  prevScrollValues?: ScrollState
) => void

type FusionScrollHandler = UIEventHandler & ScrollStateEventHandler

interface DapperScrollbarsProps extends StandardFunctionProps {
  /** Toggle display of tracks when no scrolling is necessary */
  removeTracksWhenNotUsed?: boolean
  /** Toggle display of vertical track when no scrolling is necessary */
  removeTrackYWhenNotUsed?: boolean
  /** Toggle display of horizontal track when no scrolling is necessary */
  removeTrackXWhenNotUsed?: boolean
  /** Disable scrolling horizontally */
  noScrollX?: boolean
  /** Disable scrolling vertically */
  noScrollY?: boolean
  /** Disable scrolling */
  noScroll?: boolean
  /** Gradient start color */
  thumbStartColor?: string | InfluxColors
  /** Gradient end color */
  thumbStopColor?: string | InfluxColors
  /** Hide scrollbar when not actively scrolling */
  autoHide?: boolean
  /** Scroll container will grow to fit the content width and height */
  autoSize?: boolean
  /** Scroll container will grow to fit the content width */
  autoSizeWidth?: boolean
  /** Scroll container will grow to fit the content height */
  autoSizeHeight?: boolean
  /** Vertical scroll position in pixels */
  scrollTop?: number
  /** Horizontal scroll position in pixels */
  scrollLeft?: number
  /** Function to be called when called scroll event fires */
  onScroll?: Function
  /** Function called after component updated */
  onUpdate?: Function
}

export const DapperScrollbars: FunctionComponent<DapperScrollbarsProps> = ({
  id,
  style,
  children,
  className,
  onScroll,
  onUpdate,
  scrollTop = 0,
  scrollLeft = 0,
  autoHide = false,
  autoSize = false,
  noScroll = false,
  noScrollX = false,
  noScrollY = false,
  autoSizeWidth = false,
  autoSizeHeight = false,
  thumbStopColor = InfluxColors.Pool,
  thumbStartColor = InfluxColors.Star,
  testID = 'dapper-scrollbars',
  removeTracksWhenNotUsed = true,
  removeTrackYWhenNotUsed = true,
  removeTrackXWhenNotUsed = true,
}) => {
  const scrollEl = useRef<any>(null)
  // State is used here to ensure that the scroll position does not jump when
  // a component using DapperScrollbars re-renders
  const [scrollTopPos, setScrollTopPos] = useState<number>(Number(scrollTop))
  const [scrollLeftPos, setScrollLeftPos] = useState<number>(Number(scrollLeft))

  useEffect(() => {
    setScrollTopPos(Number(scrollTop))
    setScrollLeftPos(Number(scrollLeft))
  }, [scrollTop, scrollLeft])

  const classes = useStyles()

  const dapperScrollbarsClass = classnames('cf-dapper-scrollbars', {
    'cf-dapper-scrollbars--autohide': autoHide,
    [`${className}`]: className,
  })

  const thumbXStyle = {
    background: `linear-gradient(to right,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const thumbYStyle = {
    background: `linear-gradient(to bottom,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const handleOnScroll = (
    scrollValues: ScrollState,
    prevScrollValues: ScrollState
  ) => {
    if (onScroll) {
      onScroll(scrollValues, prevScrollValues)
    }

    const {scrollTop, scrollLeft} = scrollValues
    setScrollTopPos(scrollTop)
    setScrollLeftPos(scrollLeft)
  }

  const handleUpdate = (scrollValues, prevScrollValues) => {
    if (onUpdate) {
      onUpdate(scrollValues, prevScrollValues)
    }
  }

  return (
    <Scrollbar
      ref={scrollEl}
      onScroll={handleOnScroll as FusionScrollHandler}
      onUpdate={handleUpdate}
      data-testid={testID}
      translateContentSizesToHolder={autoSize}
      translateContentSizeYToHolder={autoSizeHeight}
      translateContentSizeXToHolder={autoSizeWidth}
      className={classes[dapperScrollbarsClass]}
      style={style}
      noDefaultStyles={false}
      removeTracksWhenNotUsed={removeTracksWhenNotUsed}
      removeTrackYWhenNotUsed={removeTrackYWhenNotUsed}
      removeTrackXWhenNotUsed={removeTrackXWhenNotUsed}
      noScrollX={noScrollX}
      noScrollY={noScrollY}
      noScroll={noScroll}
      wrapperProps={{className: classes['cf-dapper-scrollbars--wrapper']}}
      contentProps={{className: classes['cf-dapper-scrollbars--content']}}
      trackXProps={{className: classes['cf-dapper-scrollbars--track-x']}}
      thumbXProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbXStyle}
          return (
            <div
              className={classes['cf-dapper-scrollbars--thumb-x']}
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}-thumb-x`}
            />
          )
        },
      }}
      trackYProps={{className: classes['cf-dapper-scrollbars--track-y']}}
      thumbYProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbYStyle}
          return (
            <div
              className={classes['cf-dapper-scrollbars--thumb-y']}
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}-thumb-y`}
            />
          )
        },
      }}
      scrollTop={scrollTopPos}
      scrollLeft={scrollLeftPos}
      id={id}
      download={null}
      inlist={null}
    >
      {children}
    </Scrollbar>
  )
}

DapperScrollbars.displayName = 'DapperScrollbars'
