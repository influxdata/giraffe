import L from 'leaflet'

/*
 * Based on https://github.com/TA-Geoforce/react-leaflet-bing-v2
 */
export const BingLayerObject = L.TileLayer.extend({
  options: {
    subdomains: [0, 1, 2, 3],
    type: 'Aerial',
    attribution: 'Bing',
    culture: '',
    style: '',
  },

  initialize: function(bing_key, options) {
    L.Util.setOptions(this, options)

    this._bing_key = bing_key
    this._url = null
    this._providers = []
    this.metaRequested = false
  },

  tile2quad: function(x, y, z) {
    let quad = ''
    for (let i = z; i > 0; i--) {
      let digit = 0
      const mask = 1 << (i - 1)
      if ((x & mask) !== 0) {
        digit += 1
      }
      if ((y & mask) !== 0) {
        digit += 2
      }
      quad = quad + digit
    }
    return quad
  },

  getTileUrl: function(tilePoint) {
    const zoom = this._getZoomForUrl()
    const subdomains = this.options.subdomains,
      s = this.options.subdomains[
        Math.abs((tilePoint.x + tilePoint.y) % subdomains.length)
      ]
    return this._url
      .replace('{subdomain}', s)
      .replace('{quadkey}', this.tile2quad(tilePoint.x, tilePoint.y, zoom))
      .replace('{culture}', this.options.culture)
  },

  loadMetadata: function() {
    if (this.metaRequested) {
      return
    }
    this.metaRequested = true
    const cbid = '_bing_metadata_' + L.Util.stamp(this)
    window[cbid] = meta => {
      window[cbid] = undefined
      const e = document.getElementById(cbid)
      e.parentNode.removeChild(e)
      if (meta.errorDetails) {
        return
      }
      this.initMetadata(meta)
    }
    const urlScheme =
      document.location.protocol === 'file:'
        ? 'http'
        : document.location.protocol.slice(0, -1)
    const url =
      urlScheme +
      '://dev.virtualearth.net/REST/v1/Imagery/Metadata/' +
      this.options.type +
      '?include=ImageryProviders&jsonp=' +
      cbid +
      '&key=' +
      this._bing_key +
      '&UriScheme=' +
      urlScheme +
      '&culture=' +
      this.options.culture +
      '&style=' +
      this.options.style
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.id = cbid
    document.getElementsByTagName('head')[0].appendChild(script)
  },

  initMetadata: function(meta) {
    const r = meta.resourceSets[0].resources[0]
    this.options.subdomains = r.imageUrlSubdomains
    this._url = r.imageUrl
    if (r.imageryProviders) {
      for (let i = 0; i < r.imageryProviders.length; i++) {
        const p = r.imageryProviders[i]
        for (let j = 0; j < p.coverageAreas.length; j++) {
          const c = p.coverageAreas[j]
          const coverage: any = {
            zoomMin: c.zoomMin,
            zoomMax: c.zoomMax,
            active: false,
          }
          const bounds = new L.LatLngBounds(
            new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01),
            new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01)
          )
          coverage.bounds = bounds
          coverage.attrib = p.attribution
          this._providers.push(coverage)
        }
      }
    }
    this._update()
  },

  _update: function() {
    if (this._url === null || !this._map) {
      return
    }
    this._update_attribution()
    L.TileLayer.prototype._update.apply(this, [])
  },

  _update_attribution: function() {
    const bounds = this._map.getBounds()
    const zoom = this._map.getZoom()
    for (let i = 0; i < this._providers.length; i++) {
      const p = this._providers[i]
      if (
        zoom <= p.zoomMax &&
        zoom >= p.zoomMin &&
        bounds.intersects(p.bounds)
      ) {
        if (!p.active && this._map.attributionControl) {
          this._map.attributionControl.addAttribution(p.attrib)
        }
        p.active = true
      } else {
        if (p.active && this._map.attributionControl) {
          this._map.attributionControl.removeAttribution(p.attrib)
        }
        p.active = false
      }
    }
  },

  onAdd: function(map) {
    this.loadMetadata()
    L.TileLayer.prototype.onAdd.apply(this, [map])
  },

  onRemove: function(map) {
    for (let i = 0; i < this._providers.length; i++) {
      const p = this._providers[i]
      if (p.active && this._map.attributionControl) {
        this._map.attributionControl.removeAttribution(p.attrib)
        p.active = false
      }
    }
    L.TileLayer.prototype.onRemove.apply(this, [map])
  },
})
