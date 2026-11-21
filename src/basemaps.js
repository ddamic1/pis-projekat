import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import { googleAvailable, showGoogle } from './google';

proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
register(proj4);
const yandexProjection = getProjection('EPSG:3395');
yandexProjection.setExtent([-20037508.34, -20037508.34, 20037508.34, 20037508.34]);

export const basemaps = [
  {
    id: 'osm',
    title: 'OpenStreetMap',
    layer: new TileLayer({ source: new OSM(), visible: true }),
  },
  {
    id: 'google',
    title: 'Google Maps',
    available: googleAvailable,
  },
  {
    id: 'yandex',
    title: 'Yandex Maps',
    layer: new TileLayer({
      visible: false,
      source: new XYZ({
        projection: yandexProjection,
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
        attributions: '© Яндекс',
        maxZoom: 19,
      }),
    }),
  },
];

export function showBasemap(id) {
  for (const b of basemaps) b.layer?.setVisible(b.id === id);
  showGoogle(id === 'google').catch((e) => console.warn(e));
}
