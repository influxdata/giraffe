import {lineStat} from './line'
import {binStat} from './bin'
import {bin2dStat} from './bin2d'

export const stats = {
  line: lineStat,
  histogram: binStat,
  heatmap: bin2dStat,
}
