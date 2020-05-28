const streamReduce = require('json-stream-reduce')
const path = require('path');

var errors  = 0;
var skipped = 0;

streamReduce({
  map: path.join(__dirname, 'filter-map.js'),             //Map function
  file: path.join(__dirname, 'features.geojsonseq'),      //Input file (lines of JSON)
  maxWorkers:32 // The number of cpus you'd like to use
})
.on('reduce', function(res) {
  skipped += res[0]
  errors  += res[1]
})
.on('end', function() {
  console.error("Finished - skipped " + skipped + " features with " + errors + " errors");
});