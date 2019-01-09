'use strict';

var tileReduce = require("@mapbox/tile-reduce")
var fs = require('fs')
var path = require('path');

// var missingInOld = fs.createWriteStream('missing-in-old.geojsonl');
// var missingInNew = fs.createWriteStream('missing-in-new.geojsonl');

// var sameCount = 0;
// var oldBigger = 0;
// var newBigger = 0;

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

  var types = {
      "relation" : 0,
      "way"      : 0,
      "node"     : 0
  }


tileReduce({
    map: path.join(__dirname, '/map-feature-analysis.js'),
    sources: [
        {name: 'new',
         mbtiles: "../../latest.planet.mbtiles",
         raw: false},
        {name: 'quarterly', 
         mbtiles: "../../2018-Q3-qa-tiles.mbtiles",
         raw: false}
    ],
    output: fs.createWriteStream('tmp2.log'),
    geojson: bounds,
    zoom: 12,
})
.on('reduce', function(res) {
    types.relation += res.relation
    types.way += res.way
    types.node += res.node
//     if (res.same){
//         sameCount++;
//     }else{
//         if (res.bigger == 'current' ){
//             oldBigger++;
//         }else{
//             newBigger++;
//         }
//     }
//     if(res.missingInOld.length){
//         res.missingInOld.forEach(function(f){
//             missingInOld.write(JSON.stringify(f)+"\n");
//         })
//     }
//     if(res.missingInNew.length){
//         res.missingInNew.forEach(function(f){
//             missingInNew.write(JSON.stringify(f)+"\n");
//         })
//     }
})
.on('end', function() {
//     console.error("\nTiles that matched: " + sameCount);
//     console.error("2018-Q3 QA bigger:  " + oldBigger);
//     console.error("Latest QA Tile bigger: " + newBigger);
    console.error(JSON.stringify(types))
    console.error("DONE")
});