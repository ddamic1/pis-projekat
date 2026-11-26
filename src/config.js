export const GEOSERVER = '/geoserver';
export const WORKSPACE = 'pis';
export const WMS_URL = `${GEOSERVER}/${WORKSPACE}/wms`;
export const WFS_URL = `${GEOSERVER}/${WORKSPACE}/wfs`;

export const SERBIA_EXTENT_4326 = [18.8, 42.2, 23.1, 46.2];

const number = new Intl.NumberFormat('sr-Latn', { maximumFractionDigits: 1 });
const km2 = (m2) => number.format(m2 / 1e6);
const km = (m) => number.format(m / 1e3);

const EKOREGIONI = { ER_5Ser: 'Dinarski zapadni Balkan', ER_7: 'Istočni Balkan', ER_10: 'Karpati', ER_11: 'Panonska nizija' };
const ekoregion = (code) => EKOREGIONI[code];
const vrsta = (awb) => (awb === 'yes' ? 'kanal' : 'reka');
const snaga = (mw) => (Number(mw) > 0 ? mw : 'nema podatka');

export const WMS_LAYERS = [
  { id: 'drzava', name: 'pis:drzava', title: 'Državna granica', popup: 'Država', color: '#b5121b', geometry: 'polygon', info: [['naziv', 'Naziv'], ['povrsina', 'Površina (km²)', km2], ['obim', 'Obim (km)', km]] },
  { id: 'okruzi', name: 'pis:okruzi', title: 'Upravni okruzi', popup: 'Upravni okrug', color: '#1d3557', geometry: 'polygon', info: [['Naziv', 'Naziv'], ['Area', 'Površina (km²)', km2]] },
  { id: 'reke', name: 'pis:reke', title: 'Reke', popup: 'Vodotok', color: '#1f6fb2', geometry: 'line', info: [['naziv', 'Naziv'], ['awb', 'Vrsta', vrsta], ['ekoregioni', 'Ekoregion', ekoregion]] },
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
    fields: [['naziv', 'Naziv'], ['kod', 'Kod'], ['snaga', 'Instalisana snaga (MW)', snaga], ['nivo', 'Nivo']],
  },
  {
    id: 'termoelektrane',
    name: 'pis:termoelektrane',
    title: 'Termoelektrane',
    popup: 'Termoelektrana',
    color: '#e53935',
    shape: 'square',
    power: 'snagagen',
    fields: [['naziv', 'Naziv'], ['kod', 'Kod'], ['snagagen', 'Snaga generatora (MW)', snaga], ['snagaprag', 'Prag snage (MW)', snaga]],
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
