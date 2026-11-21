# PIS projekat

Prikaz prostornih podataka Srbije u OpenLayers-u. Osnovne mape su OpenStreetMap, Google Maps i Yandex, a slojevi dolaze sa GeoServera: shapefile-ovi preko WMS-a i tabele iz PostGIS baze preko WFS-a.

## Pokretanje

1. Baza:

   ```
   docker run --name pis-postgis -e POSTGRES_PASSWORD=pis2026 -e POSTGRES_DB=pis -p 5432:5432 -d postgis/postgis:17-3.5
   docker exec -i pis-postgis psql -U postgres -d pis < sql/pis_dump.sql
   ```

2. GeoServer: radni prostor `pis`, jedno skladište za folder `data/shapefiles` (kodna strana windows-1250) i jedno za bazu `pis` (uključiti Validate connections). Stilovi su u `geoserver/styles`.

3. Za Google Maps treba API ključ: kopirati `.env.example` u `.env.local` i upisati ključ.

4. Aplikacija:

   ```
   npm install
   npm run dev
   ```

   Otvara se na http://localhost:5173. Zahtevi ka `/geoserver` idu na http://localhost:8080.

## Folderi

- `src` kod aplikacije
- `sql` skripte za bazu
- `data/shapefiles` shapefile-ovi
- `geoserver/styles` SLD stilovi
