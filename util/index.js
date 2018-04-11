'use strict';

var bounds = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -74.83579874038696,
              40.41558722527381
            ],
            [
              -73.21014404296875,
              40.41558722527381
            ],
            [
              -73.21014404296875,
              41.22103488570684
            ],
            [
              -74.83579874038696,
              41.22103488570684
            ],
            [
              -74.83579874038696,
              40.41558722527381
            ]
          ]
        ]
      }
    }

bounds = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -74.7509765625,
              40.46784549077255
            ],
            [
              -73.2623291015625,
              40.46784549077255
            ],
            [
              -73.2623291015625,
              41.15797827873605
            ],
            [
              -74.7509765625,
              41.15797827873605
            ],
            [
              -74.7509765625,
              40.46784549077255
            ]
          ]
        ]
      }
    }
var tileReduce = require("@mapbox/tile-reduce")
var fs = require('fs')
var path = require('path');

// var output = fs.createWriteStream('/data/data-team-features.geojsonl')
// var changesets_out = fs.createWriteStream("/data/data-team-changeset_ids.txt")

var missingInOld = fs.createWriteStream('missing-in-old.geojsonl');
var missingInNew = fs.createWriteStream('missing-in-new.geojsonl');

var sameCount = 0;
var oldBigger = 0;
var newBigger = 0;

tileReduce({
    map: path.join(__dirname, '/map.js'),
    sources: [
        {name: 'new',
         mbtiles: 'tmp.mbtiles',
         raw: false},
        {name: 'current', 
         mbtiles: path.join("/data/planet/latest.planet.mbtiles"),
         raw: false}
    ],
    output: fs.createWriteStream('tmp.log'),
    geojson: bounds,
    zoom: 12,
})
.on('reduce', function(res) {
    if (res.same){
        sameCount++;
    }else{
        if (res.bigger == 'current' ){
            oldBigger++;
        }else{
            newBigger++;
        }
    }
    if(res.missingInOld.length){
        res.missingInOld.forEach(function(f){
            missingInOld.write(JSON.stringify(f)+"\n");
        })
    }
    if(res.missingInNew.length){
        res.missingInNew.forEach(function(f){
            missingInNew.write(JSON.stringify(f)+"\n");
        })
    }
})
.on('end', function() {
    console.error("\nTiles that matched: " + sameCount);
    console.error("Current QA bigger:  " + oldBigger);
    console.error("NEW QA Tile bigger: " + newBigger);
    console.error("DONE")
});