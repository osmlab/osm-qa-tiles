# osm-qa-tiles
Creating OSM vector tiles for tile-reduce jobs


## Creating OSM QA Tiles

#### 1. First, install [Mason](//github.com/mapbox/mason) to manage dependencies:

```
git clone --depth 1 --branch v0.18.0 https://github.com/mapbox/mason.git .mason
```

#### 2. Install [`osmium-tool`](//osmcode.org/osmium-tool/) and [`tippecanoe`](//github.com/mapbox/tippecanoe) with Mason

```
.mason/mason install osmium-tool 1.7.1
.mason/mason link osmium-tool 1.7.1

.mason/mason install tippecanoe 1.27.6
.mason/mason link tippecanoe 1.27.6
```

#### 3. Use [`osmium-export`](//osmcode.org/osmium-tool/) to convert the file to `geojsonseq`

```
./mason_packages/.link/bin/osmium export  \
  -c osm-qa-tile.osmiumconfig --overwrite \
  -f geojsonseq -r -o features.geojsonseq \
  --verbose --progress <OSM FILE>
```

_Explanation_

 - `-c osm-qa-tile.osmiumconfig`: Use the osmium config defined here.
 - `-r -f geojsonseq`: Write features as line delimited geojson features. Don't use the record separtor.


#### 4. Use [`tippecanoe`](//github.com/mapbox/tippecanoe) to tile the features

```
./mason_packages/.link/bin/tippecanoe -Pf -Z12 -z12 -d20 \
	-b0 -pf -pk -ps --no-tile-stats \
	--no-duplication -l osm -o osm-qa-tiles.mbtiles \
	features.geojsonseq 
```

_Explanation_

 - `-Pf`: Read input in parallel, overwrite existing file.
 - `-Z12 -z12 -d20`: Only render from (Z)oom 12 to (z)oom 12 with maximum (d)etail for zoom 12 (20).
 - `-b0`: No feature buffer 
 - `-pf -pk -ps`:  Don't limit tiles by size or feature count; don't simplify lines.
 - `--no-tile-stats`: OSM-QA-Tiles are not used for rendering, so do not precompute statistics about attributes (that are mostly used for rendering). 
 - `--no-duplication`: Do not duplicate features 
 - `-l osm`: Name the layer "osm"
 - `-o osm-qa-tiles.mbtiles`: Output file is named "osm-qa-tiles.mbtiles"
