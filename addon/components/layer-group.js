import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';
import ContainerMixin from 'ember-leaflet/mixins/container';

const {get, getProperties, isEmpty, set, isNone} = Ember;

export default BaseLayer.extend(ContainerMixin,{
	baselayer: false,
	blockLayer: false,
	default: false,
	createLayer(){
		return this.L.layerGroup();
	},
	didInsertElement() {
		this._super(...arguments);
		this.layerSetup();
		this.get('_childLayers').invoke('layerSetup');
		this.registerNameOnParent();
	},
	registerNameOnParent(){
		let name = get(this,'name');
		let container = this.get('containerLayer');
		let defaultState = get(this,'default');
		if (!get(this,'baselayer')){
			let layerGroups = get(container,'_layerGroups');
			if (isEmpty(layerGroups)){
				layerGroups = Ember.A();
				set(container,'_layerGroups',layerGroups);
			} 
			layerGroups.addObject({
				name:name,
				layer:get(this,'_layer'),
				default: defaultState
			});
		} else {
			let baseLayers = get(container,'_baseLayers');
			if (isEmpty(baseLayers)){
				baseLayers = Ember.A();
				set(container,'_baseLayers',baseLayers);
			}
			baseLayers.addObject({
				name:name, 
				layer:get(this,'_layer._layer'),
				default: defaultState
			});
		}
	},
	willDestroyLayer() {
		this.get('_childLayers').invoke('layerTeardown');
		this.get('_childLayers').clear();
	},
	layerSetup() {
		if (isNone(get(this,'_layer'))) {
			if (!get(this,'baselayer')){
				set(this,'blockLayer',true);
				this._layer = this.createLayer();
				this.didCreateLayer();
				if (get(this,'containerLayer')) {
					if (!isNone(get(this,'containerLayer')._layer)) {
						get(this,'containerLayer')._layer.addLayer(this._layer);
					}
				}
			} else {
				this._layer = {
					_layer: null,
					addLayer(layer){
						this._layer = layer;
					},
					removeLayer(){
						this._layer = null;
					}
				};
			}
		}
		
    }
});
