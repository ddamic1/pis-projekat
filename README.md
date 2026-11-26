# PIS projekat

Prikaz prostornih podataka Srbije u OpenLayers-u. Osnovne mape su OpenStreetMap, Google Maps i Yandex, a slojevi dolaze sa GeoServera: shapefile-ovi preko WMS-a i tabele iz PostGIS baze preko WFS-a.

Za Google Maps treba API ključ: kopirati `.env.example` u `.env.local` i upisati ključ. Bez ključa je izbor Google mape onemogućen.

## Pokretanje preko Docker-a

`start.cmd` podiže bazu, GeoServer i aplikaciju i otvara http://localhost:8000, a `stop.cmd` ih zaustavlja. Isto rade `docker compose up -d --build` i `docker compose down`.

Pri prvom pokretanju baza se puni iz `sql/pis_dump.sql`, a `geoserver/setup.sh` preko REST API-ja pravi radni prostor, skladišta, slojeve i stilove. GeoServer je na http://localhost:8081/geoserver (admin / geoserver). Podaci ostaju u Docker volume-ima, a `docker compose down -v` ih briše.

API ključ ne ulazi u Docker sliku. Docker Compose ga pri pokretanju prosleđuje kontejneru aplikacije iz `.env.local`, a kontejner tada gradi aplikaciju, pa Google Maps radi i ovde. Bez `.env.local` aplikacija radi bez Google mape.

## Pokretanje sa Docker Hub-a

Slike su objavljene na Docker Hub-u, pa je za pokretanje dovoljan fajl `docker-compose.hub.yml`, bez izvornog koda:

```
docker compose -f docker-compose.hub.yml up -d
```

Aplikacija je na http://localhost:8000, a zaustavlja se sa `docker compose -f docker-compose.hub.yml down`. Za Google Maps u isti folder treba staviti `.env.local` sa ključem.

- `dejandamic597/pis-app` aplikacija
- `dejandamic597/pis-db` PostGIS sa podacima iz `sql/pis_dump.sql`
- `dejandamic597/pis-geoserver` GeoServer sa shapefile-ovima, stilovima i skriptom za podešavanje

Slike se prave i šalju ovako:

```
docker build -t dejandamic597/pis-app .
docker build -t dejandamic597/pis-db sql
docker build -t dejandamic597/pis-geoserver -f geoserver/Dockerfile .
docker push dejandamic597/pis-app
docker push dejandamic597/pis-db
docker push dejandamic597/pis-geoserver
```

## Pokretanje bez Docker-a

1. Baza:

   ```
   docker run --name pis-postgis -e POSTGRES_PASSWORD=pis2026 -e POSTGRES_DB=pis -p 5432:5432 -d postgis/postgis:17-3.5
   docker exec -i pis-postgis psql -U postgres -d pis < sql/pis_dump.sql
   ```

2. GeoServer: radni prostor `pis`, jedno skladište za folder `data/shapefiles` (kodna strana windows-1250) i jedno za bazu `pis` (uključiti Validate connections). Stilovi su u `geoserver/styles`.

3. Aplikacija:

   ```
   npm install
   npm run dev
   ```

   Otvara se na http://localhost:5173. Zahtevi ka `/geoserver` idu na http://localhost:8080.

## Folderi

- `src` kod aplikacije
- `sql` skripte za bazu
- `data/shapefiles` shapefile-ovi
- `geoserver` SLD stilovi i skripta za podešavanje
