git clone --depth=1 https://github.com/mapbox/mason

mason/mason install osmium-tool 1.11.0
mason/mason link osmium-tool 1.11.0

mason/mason install tippecanoe 1.32.10
mason/mason link tippecanoe 1.32.10

#These are for filter-parallel if that script is getting used?
npm install json-stream-reduce
npm install @turf/area
