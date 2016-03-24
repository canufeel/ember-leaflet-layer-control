import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';

const {get,isEmpty,isBlank,isEqual} = Ember;

export default BaseLayer.extend({
  	layerSetup() {
	    this._layer = this.createLayer();
	    this._addObservers();
	    this._addEventListeners();
	    if (get(this,'containerLayer')) {
	    	this._layer.addTo(get(this,'containerLayer')._layer);
	    }
	    this.didCreateLayer();
  	},
  	createLayer(){
  		return L.control.layers();
  	},
  	didCreateLayer(){
  		let layerGroups = get(this,'containerLayer._layerGroups');
  		if (!isBlank(layerGroups)){
        layerGroups.forEach(layerGroup=>{
          if (layerGroup.default){
            let containerLayer = get(this,'containerLayer._layer');
            layerGroup.layer.addTo(containerLayer);
          }
          this._layer.addOverlay(layerGroup.layer,layerGroup.name);
        });
      }
      let baseLayers = get(this,'containerLayer._baseLayers');
      if (!isBlank(baseLayers)){
        baseLayers.forEach(baseLayer=>{
          if (baseLayer.default){
            let containerLayer = get(this,'containerLayer._layer');
            baseLayer.layer.addTo(containerLayer);
          }
          this._layer.addBaseLayer(baseLayer.layer,baseLayer.name);
        });
      }
      
      let handler = get(this,'handler') || null;
      if (!isEmpty(handler)){
        let map = get(this,'containerLayer')._layer;
        map.on('overlayadd', this.attrs.handler);
        map.on('overlayremove', this.attrs.handler);
        map.on('baselayerchange', this.attrs.handler);
      }
  	}
});
