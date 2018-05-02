import Ember from 'ember';
import BaseLayer from 'ember-leaflet/components/base-layer';
import { ParentMixin } from 'ember-composability-tools';

const {get, isEmpty, set, isNone} = Ember;

export default BaseLayer.extend(ParentMixin, {
  baselayer: false,
  blockLayer: false,
  default: false,
  createLayer(){
    return this.L.layerGroup();
  },

  registerNameOnParent(){
    let name = get(this,'name');
    let container = this.get('parentComponent');
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

  didInsertParent() {
    if (isNone(get(this,'_layer'))) {
      if (!get(this,'baselayer')){
        set(this,'blockLayer',true);
        this._layer = this.createLayer();
        if (get(this,'parentComponent')) {
          if (!isNone(get(this,'parentComponent')._layer)) {
            if(this.attrs.default){
              this.addToContainer();
            }
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
      this.didCreateLayer();
    }
  },

  didCreateLayer() {
    this._super(...arguments);
    var invokeChildDidInsertHooks = get(this, 'invokeChildDidInsertHooks');
    /* create the children of this layer group early, so they exist when we run registerNameOnParent */
    invokeChildDidInsertHooks.call(this);
  },

  invokeChildDidInsertHooks() {
    var insertedChildren = get(this, 'insertedChildren');
    if (!insertedChildren) {
      this._super(...arguments);
      this.registerNameOnParent();
      set(this, 'insertedChildren', true);
    }
  }

});
