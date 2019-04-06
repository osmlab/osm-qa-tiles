'use strict';

var tileReduce = require("@mapbox/tile-reduce")
var fs = require('fs')
var path = require('path');

var admin_count = 0;

tileReduce({
    map: path.join(__dirname, '/map.js'),
    sources: [
        {name: 'osm',
         mbtiles: "../latest.planet-compact.mbtiles",
         raw: false}
    ],
//     output: fs.createWriteStream('tmp.log'),
//     geojson: bounds,
    zoom: 12,
})
.on('reduce', function(res) {
    admin_count+=res;
})
.on('end', function() {
    console.error(admin_count);
    console.error("DONE")
});