# osm-qa-tiles

Create OSM vector tiles for tile-reduce jobs.

## A guide to creating osm-qa-tiles with `osmium` and `tippecanoe` at home

_Note: This is similar to how osm-qa-tiles available at http://osmlab.github.io/osm-qa-tiles are generated but not the exact script nor same versions of tippecanoe / osmium. These instructions are offered to allow folks to generate their own osm-qa-tiles when the primary source falls behind._

#### 1. First, install [Mason](//github.com/mapbox/mason) to easily manage dependencies:

```bash
git clone --depth=1 https://github.com/mapbox/mason
```

#### 2. Install [`osmium-tool`](//osmcode.org/osmium-tool/) and [`tippecanoe`](//github.com/mapbox/tippecanoe) with Mason

```bash
mason/mason install osmium-tool 1.11.0
mason/mason link osmium-tool 1.11.0

mason/mason install tippecanoe 1.32.10
mason/mason link tippecanoe 1.32.10
```

#### 3. Use [`osmium-export`](//osmcode.org/osmium-tool/) to convert the file to `geojsonseq`

Then go download an .osm.pbf file such as `planet-latest.mbtiles` and run osmium export. As of May 2020 this requires a machien with 128G of RAM and the output will be ~379G with ~791M features.

```bash
mason_packages/.link/bin/osmium export \
  -c osm-qa-tile.osmiumconfig --overwrite \
  -f geojsonseq -o features.geojsonseq \
  --verbose --progress <OSM FILE>
```

Flags: 

 - `-c osm-qa-tile.osmiumconfig`: Use the osmium config defined here.
 - `-f geojsonseq`: Write features as line delimited geojson features.


#### 3.5 Optional: Filter out very large polygons and administrative boundaries to create a _compact_ version for those interested in roads, buildings, etc.

```bash
cat features.geojsonseq | node filter-serial.js > compact.geojsonseq
```

Or use `json-stream-reduce`, a fork of tile-reduce to run in parallel (expecting `features.geojsonseq` to exist):

```bash
npm install json-stream-reduce
node filter-parallel.js > compact.geojsonseq
```

#### 4. Use [`tippecanoe`](//github.com/mapbox/tippecanoe) to tile the features

```
./mason_packages/.link/bin/tippecanoe -Pf -Z12 -z12 -d20 \
	-b0 -pf -pk -ps --no-tile-stats \
	-l osm -o osm-qa-tiles.mbtiles \
	features.geojsonseq 
```

Flags:

 - `-Pf`: Read input in parallel, overwrite existing file.
 - `-Z12 -z12 -d20`: Only render from (Z)oom 12 to (z)oom 12 with maximum (d)etail for zoom 12 (20).
 - `-b0`: No feature buffer 
 - `-pf -pk -ps`:  Don't limit tiles by size or feature count; don't simplify lines.
 - `--no-tile-stats`: OSM-QA-Tiles are not used for rendering, so do not precompute statistics about attributes.
 
Optional flags to consider:
 
 - `--no-duplication`: Do not duplicate features; less helpful for geometry validation, but helpful if using osm-qa-tiles to count features, users, etc. _Warning: Per this [issue](https://github.com/mapbox/tippecanoe/issues/833), `--no-duplication` will not work at d20 because some features are too large, throwing a geometry error. Could try using tippecanoe <=1.32.9, but corrupt geometries will exist in output.
 
 
#### 5. Consider adding point-representations for turn restrictions with [qa-tiles-plus](//github.com/jenningsanderson/qa-tiles-plus)
