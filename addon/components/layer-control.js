import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';
const {get,isEmpty,isBlank} = Ember;

export default BaseLayer.extend({
  didInsertParent() {
    this._layer = this.createLayer();
    this._addObservers();
    this._addEventListeners();
    if (get(this,'parentComponent')) {
      this._layer.addTo(get(this,'parentComponent')._layer);
    }
    this.didCreateLayer();
  },
  createLayer() {
    //L is defined globally by Leaflet
    return L.control.layers(); // jshint ignore:line
  },
  didCreateLayer() {
    this._super(...arguments);
    let layerGroups = get(this,'parentComponent._layerGroups');
    if (!isBlank(layerGroups)){
      layerGroups.forEach(layerGroup => {
        let parentLayer = get(this,'parentComponent._layer');
        if (layerGroup.default){
          layerGroup.layer.addTo(parentLayer);
        } else {
          layerGroup.layer.removeFrom(parentLayer);
        }
        this._layer.addOverlay(layerGroup.layer, layerGroup.name);
      });
    }
    let baseLayers = get(this,'parentComponent._baseLayers');
    if (!isBlank(baseLayers)){
      baseLayers.forEach(baseLayer=>{
        if (baseLayer.default){
          let parentLayer = get(this,'parentComponent._layer');
          baseLayer.layer.addTo(parentLayer);
        }
        this._layer.addBaseLayer(baseLayer.layer, baseLayer.name);
      });
    }
    let handler = get(this,'handler') || null;
    if (!isEmpty(handler)){
      let map = get(this,'parentComponent')._layer;
      map.on('overlayadd', this.attrs.handler);
      map.on('overlayremove', this.attrs.handler);
      map.on('baselayerchange', this.attrs.handler);
    }
  }
});
