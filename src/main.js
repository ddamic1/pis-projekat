import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import { defaults as defaultControls, ScaleLine, MousePosition, FullScreen } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

import { basemaps, showBasemap } from './basemaps';
import { attachGoogle } from './google';
import { wmsLayers, wfsLayers, highlightStyle, layerSymbol, countFeatures, filters, passesFilter } from './layers';
import { SERBIA_EXTENT_4326, WMS_LAYERS, WFS_LAYERS } from './config';

const serbiaExtent = transformExtent(SERBIA_EXTENT_4326, 'EPSG:4326', 'EPSG:3857');

const markerSource = new VectorSource();
const markerLayer = new VectorLayer({
  source: markerSource,
  style: new Style({
    image: new CircleStyle({ radius: 8, fill: new Fill({ color: '#ff9800' }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
    zIndex: 1,
  }),
});
const accuracyStyle = new Style({
  fill: new Fill({ color: 'rgba(255, 152, 0, 0.12)' }),
  stroke: new Stroke({ color: '#ff9800', width: 1.5, lineDash: [6, 4] }),
  zIndex: 0,
});

const nearbySource = new VectorSource();
const nearbyLayer = new VectorLayer({
  source: nearbySource,
  style: new Style({
    fill: new Fill({ color: 'rgba(56, 189, 248, 0.14)' }),
    stroke: new Stroke({ color: '#0284c7', width: 2 }),
    image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#0284c7' }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
  }),
});

const popupEl = document.getElementById('popup');
const popupContent = popupEl.querySelector('#popup-content');
const popup = new Overlay({ element: popupEl, positioning: 'bottom-center', stopEvent: true });
popupEl.querySelector('#popup-close').addEventListener('click', () => popup.setPosition(undefined));

const map = new Map({
  target: 'map',
  layers: [...basemaps.filter((b) => b.layer).map((b) => b.layer), ...wmsLayers, nearbyLayer, ...wfsLayers, markerLayer],
  overlays: [popup],
  view: new View({ center: fromLonLat([20.9, 44.2]), zoom: 7, minZoom: 5, maxZoom: 19 }),
  controls: defaultControls().extend([
    new ScaleLine({ units: 'metric' }),
    new FullScreen(),
    new MousePosition({ coordinateFormat: createStringXY(4), projection: 'EPSG:4326', target: 'coords', placeholder: '-' }),
  ]),
});

attachGoogle(map);

const basemapsEl = document.getElementById('basemaps');
for (const b of basemaps) {
  const label = document.createElement('label');
  const missingKey = b.available === false;
  label.innerHTML = `<input type="radio" name="basemap" value="${b.id}" ${b.layer?.getVisible() ? 'checked' : ''} ${missingKey ? 'disabled' : ''}> ${b.title}${missingKey ? ' <small>(nema API ključa)</small>' : ''}`;
  label.querySelector('input').addEventListener('change', () => showBasemap(b.id));
  basemapsEl.appendChild(label);
}

function layerRow(container, layer, cfg) {
  const row = document.createElement('div');
  row.innerHTML = `<label><input type="checkbox" checked> ${cfg.title} <span class="count" id="count-${cfg.id}">...</span></label>`;
  row.querySelector('input').after(layerSymbol(cfg));
  row.querySelector('input[type=checkbox]').addEventListener('change', (e) => {
    layer.setVisible(e.target.checked);
    refreshNearby();
  });
  container.appendChild(row);
}

function visibleFeatures(layer) {
  const cfg = layer.get('cfg');
  return layer.getSource().getFeatures().filter((f) => passesFilter(cfg, f));
}

function refreshCounts() {
  for (const layer of wfsLayers) {
    const cfg = layer.get('cfg');
    const total = layer.getSource().getFeatures().length;
    if (!total) continue;
    const shown = visibleFeatures(layer).length;
    document.getElementById(`count-${cfg.id}`).textContent = shown === total ? total : `${shown} / ${total}`;
  }
}

const wmsEl = document.getElementById('wms-layers');
wmsLayers.forEach((l) => {
  const cfg = l.get('cfg');
  layerRow(wmsEl, l, cfg);
  const countEl = document.getElementById(`count-${cfg.id}`);
  countFeatures(cfg.name)
    .then((n) => (countEl.textContent = n ?? '?'))
    .catch(() => (countEl.textContent = 'greška'));
});
const wfsEl = document.getElementById('wfs-layers');
wfsLayers.forEach((l) => {
  const cfg = l.get('cfg');
  layerRow(wfsEl, l, cfg);
  l.getSource().on('featuresloadend', () => {
    refreshCounts();
    setupPowerFilter();
    setupCountryFilter();
    refreshNearby();
  });
  l.getSource().on('featuresloaderror', () => (document.getElementById(`count-${cfg.id}`).textContent = 'greška'));
});

const legendEl = document.getElementById('legend');
for (const cfg of [...WMS_LAYERS, ...WFS_LAYERS]) {
  const item = document.createElement('div');
  item.className = 'item';
  item.append(layerSymbol(cfg), cfg.title);
  legendEl.appendChild(item);
}

function filtersChanged() {
  wfsLayers.forEach((l) => l.changed());
  refreshCounts();
  refreshNearby();
}

const powerEl = document.getElementById('power');
const powerValueEl = document.getElementById('power-value');
const powerNoteEl = document.getElementById('power-note');
const powerLayers = wfsLayers.filter((l) => l.get('cfg').power);
let maxPower = 0;

function setupPowerFilter() {
  const values = powerLayers.flatMap((l) => l.getSource().getFeatures().map((f) => Number(f.get(l.get('cfg').power)) || 0));
  maxPower = values.length ? Math.max(...values) : 0;
  refreshPowerNote();
}

function refreshPowerNote() {
  const total = powerLayers.reduce((n, l) => n + l.getSource().getFeatures().length, 0);
  const shown = powerLayers.reduce((n, l) => n + visibleFeatures(l).length, 0);
  powerValueEl.textContent = filters.minPower ? `najmanje ${filters.minPower} MW` : 'sve';
  powerNoteEl.textContent = total ? `Prikazano ${shown} od ${total} elektrana` : '';
}

powerEl.addEventListener('input', () => {
  const share = Number(powerEl.value) / 100;
  filters.minPower = Math.round(maxPower * share * share);
  filtersChanged();
  refreshPowerNote();
});

const countriesEl = document.getElementById('countries');
function setupCountryFilter() {
  const layer = wfsLayers.find((l) => l.get('cfg').group);
  const key = layer.get('cfg').group;
  const counts = {};
  for (const f of layer.getSource().getFeatures()) counts[f.get(key)] = (counts[f.get(key)] ?? 0) + 1;
  countriesEl.innerHTML = '';
  for (const name of Object.keys(counts).sort((a, b) => a.localeCompare(b, 'sr'))) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.classList.toggle('on', !filters.hiddenGroups.has(name));
    chip.innerHTML = `${name} <small>${counts[name]}</small>`;
    chip.addEventListener('click', () => {
      if (filters.hiddenGroups.has(name)) filters.hiddenGroups.delete(name);
      else filters.hiddenGroups.add(name);
      chip.classList.toggle('on', !filters.hiddenGroups.has(name));
      filtersChanged();
    });
    countriesEl.appendChild(chip);
  }
}

function showPopup(coordinate, title, rows, note) {
  const table = rows
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join('');
  const noteHtml = note ? `<p class="popup-note">${note}</p>` : '';
  popupContent.innerHTML = `<h3>${title}</h3><table>${table || '<tr><td>bez atributa</td></tr>'}</table>${noteHtml}`;
  popup.setPosition(coordinate);
}

function featureRows(cfg, props) {
  return cfg.fields.map(([key, label, convert]) => [label, convert ? convert(props[key]) : props[key]]);
}

let highlighted = null;
function highlight(feature) {
  if (highlighted) highlighted.setStyle(undefined);
  highlighted = feature;
  if (feature) feature.setStyle(highlightStyle);
}

function showFeature(feature, cfg) {
  const coord = feature.getGeometry().getCoordinates();
  map.getView().animate({ center: coord, zoom: Math.max(map.getView().getZoom(), 11), duration: 600 });
  highlight(feature);
  showPopup(coord, cfg.popup, featureRows(cfg, feature.getProperties()));
}

const pickBtn = document.getElementById('btn-pick');
const clearBtn = document.getElementById('btn-clear');
const radiusEl = document.getElementById('radius');
const radiusValueEl = document.getElementById('radius-value');
const nearbyNoteEl = document.getElementById('nearby-note');
const nearbyEl = document.getElementById('nearby');
let picking = false;
let nearbyCenter = null;

function setPicking(on) {
  picking = on;
  pickBtn.classList.toggle('active', on);
  map.getTargetElement().classList.toggle('picking', on);
}

function refreshNearby() {
  const km = Number(radiusEl.value);
  radiusValueEl.textContent = `${km} km`;
  nearbySource.clear();
  nearbyEl.innerHTML = '';
  clearBtn.hidden = !nearbyCenter;
  if (!nearbyCenter) {
    nearbyNoteEl.textContent = 'Izaberi tačku na mapi, pa klizačem menjaj poluprečnik.';
    return;
  }
  const circle = circular(nearbyCenter, km * 1000, 128).transform('EPSG:4326', 'EPSG:3857');
  nearbySource.addFeatures([new Feature(circle), new Feature(new Point(fromLonLat(nearbyCenter)))]);
  const hits = [];
  for (const layer of wfsLayers) {
    if (!layer.getVisible()) continue;
    const cfg = layer.get('cfg');
    for (const f of visibleFeatures(layer)) {
      const distance = getDistance(nearbyCenter, toLonLat(f.getGeometry().getCoordinates())) / 1000;
      if (distance <= km) hits.push({ f, cfg, distance });
    }
  }
  hits.sort((a, b) => a.distance - b.distance);
  nearbyNoteEl.textContent = hits.length ? `Pronađeno objekata: ${hits.length}` : 'U zadatom krugu nema objekata.';
  for (const h of hits) {
    const li = document.createElement('li');
    li.innerHTML = `${h.f.get('naziv')}<small>${h.distance.toFixed(1)} km</small>`;
    li.prepend(layerSymbol(h.cfg));
    li.addEventListener('click', () => showFeature(h.f, h.cfg));
    nearbyEl.appendChild(li);
  }
}

pickBtn.addEventListener('click', () => setPicking(!picking));
clearBtn.addEventListener('click', () => {
  nearbyCenter = null;
  setPicking(false);
  refreshNearby();
});
radiusEl.addEventListener('input', refreshNearby);
refreshNearby();

map.on('singleclick', async (evt) => {
  if (picking) {
    nearbyCenter = toLonLat(evt.coordinate);
    setPicking(false);
    refreshNearby();
    const circle = nearbySource.getFeatures()[0].getGeometry();
    map.getView().fit(circle.getExtent(), { padding: [40, 40, 40, 40], duration: 600 });
    return;
  }

  let hit = null;
  map.forEachFeatureAtPixel(
    evt.pixel,
    (feature, layer) => {
      if (layer && layer.get('cfg')) {
        hit = { feature, cfg: layer.get('cfg') };
        return true;
      }
      return false;
    },
    { hitTolerance: 6 },
  );
  if (hit) {
    highlight(hit.feature);
    showPopup(hit.feature.getGeometry().getCoordinates(), hit.cfg.popup, featureRows(hit.cfg, hit.feature.getProperties()));
    return;
  }
  highlight(null);

  const view = map.getView();
  for (const layer of [...wmsLayers].reverse()) {
    if (!layer.getVisible()) continue;
    const cfg = layer.get('cfg');
    const url = layer.getSource().getFeatureInfoUrl(evt.coordinate, view.getResolution(), view.getProjection(), {
      INFO_FORMAT: 'application/json',
      FEATURE_COUNT: 1,
    });
    if (!url) continue;
    try {
      const json = await (await fetch(url)).json();
      if (json.features && json.features.length) {
        const props = json.features[0].properties;
        showPopup(evt.coordinate, cfg.popup, cfg.info.map(([k, label, convert]) => [label, convert ? convert(props[k]) : props[k]]));
        return;
      }
    } catch (e) {
      console.warn('GetFeatureInfo', cfg.name, e);
    }
  }
  popup.setPosition(undefined);
});

map.on('pointermove', (evt) => {
  if (picking) return;
  const hasFeature = map.hasFeatureAtPixel(evt.pixel, {
    hitTolerance: 6,
    layerFilter: (l) => Boolean(l.get('cfg')) && l instanceof VectorLayer,
  });
  map.getTargetElement().style.cursor = hasFeature ? 'pointer' : '';
});

const searchEl = document.getElementById('search');
const resultsEl = document.getElementById('search-results');
searchEl.addEventListener('input', () => {
  const q = searchEl.value.trim().toLowerCase();
  resultsEl.innerHTML = '';
  if (q.length < 2) return;
  const hits = [];
  for (const layer of wfsLayers) {
    const cfg = layer.get('cfg');
    for (const f of layer.getSource().getFeatures()) {
      const naziv = String(f.get('naziv') ?? '');
      if (naziv.toLowerCase().includes(q)) hits.push({ f, cfg, naziv });
    }
  }
  for (const h of hits.slice(0, 15)) {
    const li = document.createElement('li');
    li.innerHTML = `${h.naziv}<small>${h.cfg.title}</small>`;
    li.addEventListener('click', () => showFeature(h.f, h.cfg));
    resultsEl.appendChild(li);
  }
});

function formatAccuracy(m) {
  if (m >= 10000) return `${Math.round(m / 1000)} km`;
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${Math.round(m)} m`;
}

document.getElementById('btn-serbia').addEventListener('click', () => {
  map.getView().fit(serbiaExtent, { padding: [20, 20, 20, 20], duration: 600 });
});

document.getElementById('btn-locate').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolokacija nije dostupna u ovom pregledaču.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { longitude: lon, latitude: lat, accuracy } = pos.coords;
      const coord = fromLonLat([lon, lat]);
      const circle = circular([lon, lat], accuracy, 128).transform('EPSG:4326', 'EPSG:3857');
      const circleFeature = new Feature(circle);
      circleFeature.setStyle(accuracyStyle);
      markerSource.clear();
      markerSource.addFeatures([circleFeature, new Feature(new Point(coord))]);
      map.getView().fit(circle.getExtent(), { padding: [80, 80, 80, 80], maxZoom: 16, duration: 800 });
      const decimals = accuracy >= 10000 ? 2 : accuracy >= 1000 ? 3 : 5;
      const note = accuracy > 1000 ? 'Lokacija je približna' : null;
      showPopup(coord, 'Moja lokacija', [
        ['Širina', lat.toFixed(decimals)],
        ['Dužina', lon.toFixed(decimals)],
        ['Tačnost', formatAccuracy(accuracy)],
      ], note);
    },
    (err) => alert('Lokacija nije dostupna: ' + err.message),
    { enableHighAccuracy: true, timeout: 10000 },
  );
});
