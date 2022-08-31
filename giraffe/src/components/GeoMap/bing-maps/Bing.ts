import PropTypes from 'prop-types'
import {GridLayer, withLeaflet} from 'react-leaflet'
import {BingLayerObject} from './BingLayerObject'

class BingLayer extends GridLayer {
  static propTypes = {
    bingkey: PropTypes.string.isRequired,
  }

  createLeafletElement(props) {
    return new BingLayerObject(props.bingkey, super.getOptions(props))
  }
}

export default withLeaflet(BingLayer)
