set -e

G=http://geoserver:8080/geoserver/rest
A=admin:geoserver

if curl -sf -o /dev/null -u $A $G/workspaces/pis/layergroups/srbija.json; then
  echo "GeoServer je vec podesen"
  exit 0
fi

echo "Podesavam GeoServer"
curl -s -o /dev/null -u $A -X DELETE "$G/workspaces/pis?recurse=true"

post() {
  curl -sSf -u $A -H "Content-Type: application/json" "$G/$1" -d "$2" > /dev/null
}

layer() {
  post workspaces/pis/datastores/$1/featuretypes "{\"featureType\": {\"name\": \"$2\", \"title\": \"$3\", \"srs\": \"$4\", \"projectionPolicy\": \"FORCE_DECLARED\"}}"
  curl -sSf -u $A -H "Content-Type: application/vnd.ogc.sld+xml" --data-binary "@/geoserver/styles/$2.sld" "$G/workspaces/pis/styles?name=$2" > /dev/null
  curl -sSf -u $A -X PUT -H "Content-Type: application/json" "$G/workspaces/pis/layers/$2" -d "{\"layer\": {\"defaultStyle\": {\"name\": \"$2\", \"workspace\": \"pis\"}}}" > /dev/null
}

post namespaces '{"namespace": {"prefix": "pis", "uri": "https://pis.ftn.uns.ac.rs"}}'

post workspaces/pis/datastores '{"dataStore": {"name": "shapefiles", "type": "Directory of spatial files (shapefiles)",
  "connectionParameters": {"entry": [
    {"@key": "url", "$": "file:///data/shapefiles"},
    {"@key": "charset", "$": "windows-1250"},
    {"@key": "create spatial index", "$": "true"},
    {"@key": "namespace", "$": "https://pis.ftn.uns.ac.rs"}]}}}'

post workspaces/pis/datastores '{"dataStore": {"name": "postgis", "type": "PostGIS",
  "connectionParameters": {"entry": [
    {"@key": "dbtype", "$": "postgis"},
    {"@key": "host", "$": "db"},
    {"@key": "port", "$": "5432"},
    {"@key": "database", "$": "pis"},
    {"@key": "schema", "$": "public"},
    {"@key": "user", "$": "postgres"},
    {"@key": "passwd", "$": "pis2026"},
    {"@key": "Expose primary keys", "$": "true"},
    {"@key": "validate connections", "$": "true"},
    {"@key": "Test while idle", "$": "true"},
    {"@key": "namespace", "$": "https://pis.ftn.uns.ac.rs"}]}}}'

layer shapefiles drzava "Državna granica Srbije" EPSG:31277
layer shapefiles okruzi "Upravni okruzi" EPSG:31277
layer shapefiles reke "Reke" EPSG:31277
layer postgis hidroelektrane "Hidroelektrane" EPSG:4326
layer postgis termoelektrane "Termoelektrane" EPSG:4326
layer postgis granicni_prelazi "Granični prelazi" EPSG:4326

post workspaces/pis/layergroups '{"layerGroup": {"name": "srbija", "mode": "SINGLE", "title": "Srbija: granica, okruzi i reke",
  "publishables": {"published": [
    {"@type": "layer", "name": "pis:drzava"},
    {"@type": "layer", "name": "pis:okruzi"},
    {"@type": "layer", "name": "pis:reke"}]}}}'

echo "GeoServer je podesen"
