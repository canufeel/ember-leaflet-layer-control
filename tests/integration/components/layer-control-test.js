import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import LayerControlComponent from 'ember-leaflet-layer-control/components/layer-control';
import locations from '../../helpers/locations';
import Ember from 'ember';
const {get} = Ember;
/* global L */

//Needed to silence leaflet autodetection error
L.Icon.Default.imagePath = 'some-path';

let layerControl;

moduleForComponent('layer-control', 'Integration | Component | layer control', {
  integration: true,
  beforeEach() {

    this.register('component:layer-control', LayerControlComponent.extend({
      init() {
        this._super(...arguments);
        layerControl = this;
      }
    }));

    this.set('center', locations.nyc);
    this.set('zoom', 13);
  },
  afterEach() {
  }
});

test('it works as expected', function(assert) {
  this.set('locations',locations);
  this.set('layerControl',layerControl);
  this.set('tileLayerName',"tilelayer#1");
  this.set('layerGroupName',"markerLayer#1");
  this.render(hbs`
    {{#leaflet-map center=center zoom=zoom}}

      {{#layer-group name=tileLayerName baselayer=true default=true}}
        {{tile-layer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}}
      {{/layer-group}}

      {{#layer-group name=layerGroupName default=true}}
        {{marker-layer location=locations.nyc}}
      {{/layer-group}}

      {{layer-control}}

    {{/leaflet-map}}


  `);
  assert.ok(layerControl._layer._baseLayersList.innerText.indexOf(get(this,'tileLayerName')));
  assert.ok(layerControl._layer._overlaysList.innerText.indexOf(get(this,'layerGroupName')));
});
