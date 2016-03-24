# Ember-leaflet-layer-control

Provides Interface for Layer Control functionality in [Ember-Leaflet](http://ember-leaflet.com), an Ember Addon for [Leaflet](http://leafletjs.com) interactive maps.

This plugin utilizes Leaflet [Layer Groups](http://leafletjs.com/reference.html#layergroup) to create overlay layers in Leaflet [Layer Control](http://leafletjs.com/reference.html#control-layers) and also enables to identify Leaflet [Tile Layers](http://leafletjs.com/reference.html#tilelayer) as baselayers in Layer Control. You can see the demo of Native Leaflet Layer Control implementation [here](http://leafletjs.com/examples/layers-control-example.html).


![Layer Control](https://cloud.githubusercontent.com/assets/5106750/14034089/d9972a14-f230-11e5-94f7-7e915ff9dbd7.png "Layer control in use")

## Installation

* `ember install ember-leaflet-layer-control`

## Using the plugin

The following example summarizes the usage of the plugin by simple example:

template.hbs
```handlebars
{{#leaflet-map lat=lat lng=lng zoom=zoom}}

  {{#layer-group name="tilelayer#1" baselayer=true default=true}}
    {{tile-layer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}}
  {{/layer-group}}

  {{#layer-group name="tilelayer#2" baselayer=true}}
    {{google-tile-layer type="SATELLITE" opacity=0.9}}
  {{/layer-group}}

  {{#layer-group name="markerLayer#1" default=true}}
      {{#each markers as |marker|}}
        {{#marker-layer location=marker.location}}
          <h3>{{marker.title}}</h3>
          {{marker.description}}
        {{/marker-layer}}
      {{/each}}
  {{/layer-group}}

  {{#layer-group name="polylineLayer#1"}}
    {{#each polylines as |polyline|}}
      {{#polyline-layer locations=polyline.locations}}
        <h3>{{polyline.title}}</h3>
        {{polyline.description}}
      {{/polyline-layer}}
    {{/each}}
  {{/layer-group}}

  {{layer-control handler=(action "layerControlEvent")}}

{{/leaflet-map}}
```

component.js
```javascript
import Ember from 'ember';

export default Ember.Component.extend({
  lat: 53.318602,
  lng: 48.586415,
  zoom: 15,
  markers: [
    {
      title:"marker1",
      description:"this is marker1",
      location: L.LatLng(53.318602,48.586415)
    }
  ],
  polylines:[
  // some polyline data here.
  ],
  actions: {
    layerControlEvent(event){

    }  
  }
});

```

####Baselayers
Creating such component would result in a leaflet map with layer-control element. On load the tile layer `tilelayer#1` is selected in layer control and enabled on the map. Both `tilelayer#1` and `tilelayer#2` are shown in layer control as radio buttons. This happens as they both have `baselayer=true` so they are identified as baselayers. There must be just one baselayer per each `{{#layer-group}}{{/layer-group}}` block. The names of layers can be set by setting the `name` attribute on the block. This names currently only are valid during initialization and are not bound. to the values in leaflet layer control. You can use baselayer control to enable seamless support of [Google tile layers](https://github.com/miguelcobain/ember-leaflet-google-tile-layer) implemented as other ember-leaflet plugin.

####Layergroups
Layer groups with names `markerLayer#1` and `polylineLayer#1` are real leaflet Layer Groups and can hold as much different leaflet elements as needed and they can be also of different types together in one group. The component identifies them as native Leaflet Layer groups as the `baselayer=true` is NOT set on them. Their `name` attribute also propagates to layer control on init and they are displayed as checkboxes there. The `{{#layer-group default=true}}{{/layer-group}}` would enable the layer group on the map during init as oposed to excluding the argument or providing `false` value in which case the layer group would be disabled on init.

####Layer-control
This component is only available as blockless version. It is important that this component is placed inside the `{{#leaflet-map}}{{/leaflet-map}}` and it should come last, after all `{{#layer-group}}{{/layer-group}}` declarations.

####Handling events
You can set the action on the `layer-control` component like in the example: `{{layer-control handler=(action "layerControlEvent")}}`. Then this action would be fired on any change in Leaflet control (if we change the baselayer or tick layer group on or off). The handler would recieve the Leaflet object of the following form:
```
{
    layer: ##the layer which was triggered##,
    name: ##layer name as set on layer group##,
    overlay: ##true/false##,
    target: ##Leaflet map object##,
    type: ##"overlayadd"/"overlayremove"/"baselayerchange"##
}
```
The important parts here would be `type` which corresponds for event type:
`overlayadd` - stands for overlay layer has been ticked to the on position
`overlayremove` - stands for overlay layer has been ticked to the off position
`baselayerchange` - stands for the tile layer (baselayer) change

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
