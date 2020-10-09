// Based on work of Ilya Atkin ilya.atkin@unh.edu
// See https://github.com/iatkin/leaflet-svgicon
import L from 'leaflet'

L.DivIcon.SVGIcon = L.DivIcon.extend({
  options: {
    circleText: '',
    className: 'svg-icon',
    circleAnchor: null, //defaults to [iconSize.x/2, iconSize.x/2]
    circleColor: null, //defaults to color
    circleOpacity: null, // defaults to opacity
    circleFillColor: 'rgb(255,255,255)',
    circleFillOpacity: null, //default to opacity
    circleRatio: 0.5,
    circleWeight: null, //defaults to weight
    color: 'rgb(0,102,255)',
    fillColor: null, // defaults to color
    fillOpacity: 0.4,
    fontColor: 'rgb(0, 0, 0)',
    fontOpacity: '1',
    fontSize: null, // defaults to iconSize.x/4
    fontWeight: 'normal',
    iconAnchor: null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
    iconSize: L.point(32, 48),
    opacity: 1,
    popupAnchor: null,
    weight: 2,
  },
  initialize: function(options) {
    options = L.Util.setOptions(this, options)

    //iconSize needs to be converted to a Point object if it is not passed as one
    options.iconSize = L.point(options.iconSize)

    //in addition to setting option dependant defaults, Point-based options are converted to Point objects
    if (!options.circleAnchor) {
      options.circleAnchor = L.point(
        Number(options.iconSize.x) / 2,
        Number(options.iconSize.x) / 2
      )
    } else {
      options.circleAnchor = L.point(options.circleAnchor)
    }
    if (!options.circleColor) {
      options.circleColor = options.color
    }
    if (!options.circleFillOpacity) {
      options.circleFillOpacity = options.opacity
    }
    if (!options.circleOpacity) {
      options.circleOpacity = options.opacity
    }
    if (!options.circleWeight) {
      options.circleWeight = options.weight
    }
    if (!options.fillColor) {
      options.fillColor = options.color
    }
    if (!options.fontSize) {
      options.fontSize = Number(options.iconSize.x / 4)
    }
    if (!options.iconAnchor) {
      options.iconAnchor = L.point(
        Number(options.iconSize.x) / 2,
        Number(options.iconSize.y)
      )
    } else {
      options.iconAnchor = L.point(options.iconAnchor)
    }
    if (!options.popupAnchor) {
      options.popupAnchor = L.point(0, -0.75 * options.iconSize.y)
    } else {
      options.popupAnchor = L.point(options.popupAnchor)
    }

    options.html = this._createSVG()
  },
  _createCircle: function() {
    const cx = Number(this.options.circleAnchor.x)
    const cy = Number(this.options.circleAnchor.y)
    const radius =
      (this.options.iconSize.x / 2) * Number(this.options.circleRatio)
    const fill = this.options.circleFillColor
    const fillOpacity = this.options.circleFillOpacity
    const stroke = this.options.circleColor
    const strokeOpacity = this.options.circleOpacity
    const strokeWidth = this.options.circleWeight
    const className = this.options.className + '-circle'
    const circle =
      '<circle class="' +
      className +
      '" cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      radius +
      '" fill="' +
      fill +
      '" fill-opacity="' +
      fillOpacity +
      '" stroke="' +
      stroke +
      '" stroke-opacity=' +
      strokeOpacity +
      '" stroke-width="' +
      strokeWidth +
      '"/>'
    return circle
  },
  _createPathDescription: function() {
    const height = Number(this.options.iconSize.y)
    const width = Number(this.options.iconSize.x)
    const weight = Number(this.options.weight)
    const margin = weight / 2

    const startPoint = 'M ' + margin + ' ' + width / 2 + ' '
    const leftLine = 'L ' + width / 2 + ' ' + (height - weight) + ' '
    const rightLine = 'L ' + (width - margin) + ' ' + width / 2 + ' '
    const arc =
      'A ' +
      width / 4 +
      ' ' +
      width / 4 +
      ' 0 0 0 ' +
      margin +
      ' ' +
      width / 2 +
      ' Z'

    return startPoint + leftLine + rightLine + arc
  },
  _createPath: function() {
    const pathDescription = this._createPathDescription()
    const strokeWidth = this.options.weight
    const stroke = this.options.color
    const strokeOpacity = this.options.opacity
    const fill = this.options.fillColor
    const fillOpacity = this.options.fillOpacity
    const className = this.options.className + '-path'

    return (
      '<path class="' +
      className +
      '" d="' +
      pathDescription +
      '" stroke-width="' +
      strokeWidth +
      '" stroke="' +
      stroke +
      '" stroke-opacity="' +
      strokeOpacity +
      '" fill="' +
      fill +
      '" fill-opacity="' +
      fillOpacity +
      '"/>'
    )
  },
  _createSVG: function() {
    const path = this._createPath()
    const circle = this._createCircle()
    const text = this._createText()
    const className = this.options.className + '-svg'
    const style =
      'width:' +
      this.options.iconSize.x +
      'px; height:' +
      this.options.iconSize.y +
      'px;'
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="' +
      className +
      '" style="' +
      style +
      '">' +
      path +
      circle +
      text +
      '</svg>'
    )
  },
  _createText: function() {
    const fontSize = this.options.fontSize + 'px'
    const fontWeight = this.options.fontWeight
    const lineHeight = Number(this.options.fontSize)

    const x = this.options.circleAnchor.x
    const y = this.options.circleAnchor.y + lineHeight * 0.35 //35% was found experimentally
    const circleText = this.options.circleText
    const textColor = this.options.fontColor
      .replace('rgb(', 'rgba(')
      .replace(')', ',' + this.options.fontOpacity + ')')

    const text =
      '<text text-anchor="middle" x="' +
      x +
      '" y="' +
      y +
      '" style="font-size: ' +
      fontSize +
      '; font-weight: ' +
      fontWeight +
      '" fill="' +
      textColor +
      '">' +
      circleText +
      '</text>'

    return text
  },
})

L.divIcon.svgIcon = function(options) {
  return new L.DivIcon.SVGIcon(options)
}

export const SVGIcon = function(options) {
  return new L.DivIcon.SVGIcon(options)
}
