### 2018 osm-qa-tiles

**Question:** new osm-qa-tiles created with osmium (and no `--no-duplication` flag) are much larger than previous osm-qa-tiles...

### Findings: 

#### 1. Way more tiles.

The new osm-qa-tiles have 9,718,984 tiles at z12.

With this script: [https://github.com/jenningsanderson/full-history-utils/blob/master/create-quarterly-qa-tiles.sh#L14], it's more like 1,517,772 tiles.  (am currently running for 2018-01-01

...So basically there are a lot more tiles... need to look into what exactly on these tiles?

#### 2. Duplicated Relation / Way metadata

What I've found so far: 
Relations: Example: [relation 240635](https://www.openstreetmap.org/relation/240635)

In the latest osm-qa-tile, [it is split up into 7 sections](https://github.com/osmlab/osm-qa-tiles/blob/osmium/util/relation-240635.geojson)

This means the same metadata exists 7 times.

In the 2018-Q3 file, however, which was also generated with osmium-export, [there is only 1 polygon](https://github.com/osmlab/osm-qa-tiles/blob/osmium/util/relation-240635-without-duplication.geojson).

My current theory is that the `--no-duplication` flag is doing more than I initially thought. I initially thought it was only to protect against features getting duplicated into adjacent tiles when they crossed the tile boundary. Now I think that `tippecanoe` splits larger polygons into smaller polygons at boundaries GREATER THAN max-zoom ... maybe similar to z16? From a rendering standpoint, this makes sense to keep geometries smaller... but from an analysis standpoint, the metadata exists multiple times. When calling `--no-duplication`, it ensures these polygons don't get split up (at any zoom). [See the tippecanoe README here](https://github.com/mapbox/tippecanoe#controlling-clipping-to-tile-boundaries)

The 2017-Q4 file (generated with minjur) doesn't include this relation but instead only [way 40720629](https://www.openstreetmap.org/way/40720629). This way is split into 5 MultiLineString objects. So, we're definitely doing bretter than minjur :) 

I imagine that if there are enough objects like this, it could definitely inflate the file size dramatically, but more importantly, for analysis work... it's (quite) misleading.

Probably worth asking Eric Fischer if this could be what's happening in tippecanoe?

In sum: 164,930 tiles have duplicated Relation features (map forthcoming)

Total duplicated features: 

	{
		"relation":418629,
	 	"way":429441,
	 	"node":0
	}
	
	
####Looking forward: 
What are the specific uses of osm-qa-tiles? Specifically, if it's buildings, roads, POIs, then we should probably be generating distinct tilesets with just these features?