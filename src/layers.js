import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import ImageWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Circle as CircleStyle, RegularShape } from 'ol/style';
import { WMS_URL, WFS_URL, WMS_LAYERS, WFS_LAYERS } from './config';

function pointStyle(color, shape) {
  const fill = new Fill({ color });
  const stroke = new Stroke({ color: '#ffffff', width: 1.5 });
  if (shape === 'square') return new Style({ image: new RegularShape({ fill, stroke, points: 4, radius: 7, angle: Math.PI / 4 }) });
  if (shape === 'triangle') return new Style({ image: new RegularShape({ fill, stroke, points: 3, radius: 8 }) });
  return new Style({ image: new CircleStyle({ fill, stroke, radius: 6 }) });
}

export const highlightStyle = new Style({
  image: new CircleStyle({ radius: 11, fill: new Fill({ color: 'rgba(255, 235, 59, 0.5)' }), stroke: new Stroke({ color: '#f9a825', width: 2 }) }),
});

export const filters = { minPower: 0, hiddenGroups: new Set() };

export function passesFilter(cfg, feature) {
  if (cfg.power && (Number(feature.get(cfg.power)) || 0) < filters.minPower) return false;
  if (cfg.group && filters.hiddenGroups.has(feature.get(cfg.group))) return false;
  return true;
}

export const wmsLayers = WMS_LAYERS.map((cfg) => {
  const layer = new ImageLayer({
    source: new ImageWMS({
      url: WMS_URL,
      params: { LAYERS: cfg.name, FORMAT: 'image/png', TRANSPARENT: true },
      serverType: 'geoserver',
      ratio: 1.3,
    }),
  });
  layer.set('cfg', cfg);
  return layer;
});

export const wfsLayers = WFS_LAYERS.map((cfg) => {
  const url = `${WFS_URL}?service=WFS&version=2.0.0&request=GetFeature&typeName=${cfg.name}`
    + '&outputFormat=application/json&srsName=EPSG:3857';
  const source = new VectorSource({ format: new GeoJSON(), url });
  const style = pointStyle(cfg.color, cfg.shape);
  const layer = new VectorLayer({
    source,
    style: (feature) => (passesFilter(cfg, feature) ? style : null),
  });
  layer.set('cfg', cfg);
  return layer;
});

export function legendUrl(layerName) {
  return `${WMS_URL}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&FORMAT=image/png&WIDTH=16&HEIGHT=16&LAYER=${layerName}&TRANSPARENT=true`;
}

export async function countFeatures(layerName) {
  const url = `${WFS_URL}?service=WFS&version=2.0.0&request=GetFeature&typeName=${layerName}&resultType=hits`;
  const text = await (await fetch(url)).text();
  const m = text.match(/numberMatched="(\d+)"/);
  return m ? Number(m[1]) : null;
}
