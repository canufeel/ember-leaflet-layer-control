import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import LayerGroupComponent from 'ember-leaflet-layer-control/components/layer-group';
import locations from '../../helpers/locations';
import Ember from 'ember';
const {get} = Ember;

let layerGroup;

moduleForComponent('layer-group', 'Integration | Component | layer group', {
  integration: true,
  beforeEach() {

    this.register('component:layer-group', LayerGroupComponent.extend({
      init() {
        this._super(...arguments);
        layerGroup = this;
      }
    }));

    this.set('center', locations.nyc);
    this.set('zoom', 13);
  },
  afterEach() {
  }
});

test('layer group renders', function(assert) {
  this.set('locations',locations);
  this.render(hbs`
    
    {{#leaflet-map center=center zoom=zoom}}

      {{#layer-group name="tilelayer#1" baselayer=true default=true}}
        {{marker-layer location=locations.nyc}}
      {{/layer-group}}

    {{/leaflet-map}}

    `);

  assert.equal(layerGroup._childLayers.length,1);
});

test('layer group registers baselayers on parent', function(assert) {
  this.set('name',"tilelayer#1");
  this.render(hbs`
    
    {{#leaflet-map center=center zoom=zoom}}

      {{#layer-group name=name baselayer=true default=true}}
        {{tile-layer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}}
      {{/layer-group}}

    {{/leaflet-map}}

    `);
  let baseLayers = get(layerGroup,'containerLayer._baseLayers');
  assert.equal(get(baseLayers,'length'),1);
  assert.equal(get(baseLayers,'firstObject.name'),get(this,'name'));
  assert.equal(get(baseLayers,'firstObject.default'),true);
});

test('layer group registers overlays on parent', function(assert) {
  this.set('name',"overlayLayer#1");
  this.set('locations', Ember.A([locations.nyc,locations.sf,locations.chicago]));
  this.render(hbs`
  
    {{#leaflet-map center=center zoom=zoom}}

      {{#layer-group name=name}}
        {{#each locactions as |location|}}
          {{marker-layer location=location}}
        {{/each}}
      {{/layer-group}}

    {{/leaflet-map}}

    `);
  let layerGroups = get(layerGroup,'containerLayer._layerGroups');
  assert.equal(get(layerGroups,'length'),1);
  assert.equal(get(layerGroups,'firstObject.name'),get(this,'name'));
  assert.equal(get(layerGroups,'firstObject.default'),false);
});
