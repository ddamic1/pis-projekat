import { toLonLat } from 'ol/proj';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = 'DEMO_MAP_ID';

export const googleAvailable = Boolean(API_KEY);

const element = document.getElementById('gmap');
let olMap = null;
let googleMap = null;
let api = null;
let shown = false;

function loadApi() {
  api ??= new Promise((resolve, reject) => {
    window.onGoogleMapsLoaded = resolve;
    const params = new URLSearchParams({
      key: API_KEY,
      v: 'weekly',
      language: 'sr',
      region: 'RS',
      loading: 'async',
      callback: 'onGoogleMapsLoaded',
    });
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.onerror = () => reject(new Error('Google Maps JavaScript API nije učitan'));
    document.head.append(script);
  }).then(() => google.maps.importLibrary('maps'));
  return api;
}

function syncCamera() {
  if (!googleMap || !shown) return;
  const view = olMap.getView();
  const [lng, lat] = toLonLat(view.getCenter());
  googleMap.moveCamera({
    center: { lat, lng },
    zoom: view.getZoom(),
    heading: (-view.getRotation() * 180) / Math.PI,
  });
}

export function attachGoogle(map) {
  olMap = map;
  map.getView().on(['change:center', 'change:resolution', 'change:rotation'], syncCamera);
}

export async function showGoogle(visible) {
  shown = visible;
  element.hidden = !visible;
  olMap.getTargetElement().classList.toggle('over-google', visible);
  if (!visible) return;
  const { Map: GoogleMap } = await loadApi();
  googleMap ??= new GoogleMap(element, {
    mapId: MAP_ID,
    renderingType: 'VECTOR',
    isFractionalZoomEnabled: true,
    disableDefaultUI: true,
    gestureHandling: 'none',
  });
  syncCamera();
}
