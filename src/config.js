export const GEOSERVER = '/geoserver';
export const WORKSPACE = 'pis';
export const WMS_URL = `${GEOSERVER}/${WORKSPACE}/wms`;
export const WFS_URL = `${GEOSERVER}/${WORKSPACE}/wfs`;

export const SERBIA_EXTENT_4326 = [18.8, 42.2, 23.1, 46.2];

const km2 = (m2) => m2 / 1e6;
const km = (m) => m / 1e3;

export const WMS_LAYERS = [
  { id: 'drzava', name: 'pis:drzava', title: 'Državna granica', popup: 'Država', color: '#b5121b', info: [['naziv', 'Naziv'], ['povrsina', 'Površina (km²)', km2], ['obim', 'Obim (km)', km]] },
  { id: 'okruzi', name: 'pis:okruzi', title: 'Upravni okruzi', popup: 'Upravni okrug', color: '#1d3557', info: [['Naziv', 'Naziv'], ['Area', 'Površina (km²)', km2]] },
  { id: 'reke', name: 'pis:reke', title: 'Reke', popup: 'Reka', color: '#1f6fb2', info: [['naziv', 'Naziv'], ['tip', 'Tip'], ['ekoregioni', 'Ekoregion']] },
];

export const WFS_LAYERS = [
  {
    id: 'hidroelektrane',
    name: 'pis:hidroelektrane',
    title: 'Hidroelektrane',
    popup: 'Hidroelektrana',
    color: '#1e88e5',
    shape: 'circle',
    power: 'snaga',
    fields: [['naziv', 'Naziv'], ['kod', 'Kod'], ['snaga', 'Instalisana snaga (MW)'], ['nivo', 'Nivo']],
  },
  {
    id: 'termoelektrane',
    name: 'pis:termoelektrane',
    title: 'Termoelektrane',
    popup: 'Termoelektrana',
    color: '#e53935',
    shape: 'square',
    power: 'snagagen',
    fields: [['naziv', 'Naziv'], ['kod', 'Kod'], ['snagagen', 'Snaga generatora (MW)'], ['snagaprag', 'Prag snage (MW)']],
  },
  {
    id: 'granicni_prelazi',
    name: 'pis:granicni_prelazi',
    title: 'Granični prelazi',
    popup: 'Granični prelaz',
    color: '#43a047',
    shape: 'triangle',
    group: 'drzava',
    fields: [['naziv', 'Naziv'], ['drzava', 'Granica sa'], ['tip', 'Vrsta'], ['izvor', 'Izvor podatka']],
  },
];
