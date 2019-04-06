'use strict';

// var _ = require("lodash")

module.exports = function(data, tile, writeData, done) {
    var count = 0;
    data.osm.osm.features.forEach(function(f){
        if (f.properties.hasOwnProperty('boundary') ){
            writeData(JSON.stringify(f)+"\n");
        }
        count+=1;
    });
  
  done(null, count);
};