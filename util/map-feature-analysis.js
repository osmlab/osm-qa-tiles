'use strict';
Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}


var _ = require("lodash")

module.exports = function(data, tile, writeData, done) {
    
  var curFeatures = {}
  var newFeatures = {}
  
  var missingInNew = [];
  var missingInOld = [];
    
  var features = {}

  //Extract the osm layer from the mbtile
  var currentTiles = data.quarterly.osm;
  var newTiles     = data.new.osm;

//   var currIDs = new Set( currentTiles.features.map(function(f){
//       curFeatures[f.properties['@id']] = f;
//       return f.properties['@id']}));
  var types = {
      "relation" : 0,
      "way"      : 0,
      "node"     : 0
  }
    
  currentTiles.features.forEach(function(feat){
  
  if ( feat.properties['@id'] == 240635 ){
      
      writeData(JSON.stringify(feat)+"\n")
      
        if (!features.hasOwnProperty(feat.properties['@type']+feat.properties['@id']) ){

            features[feat.properties['@type']+feat.properties['@id']] = feat

        }else{

            types[feat.properties['@type']]++;

            console.warn( tile + ": "+ JSON.stringify(features[feat.properties['@type']+feat.properties['@id']].properties) + " | " + JSON.stringify(feat.properties) + "\n")
            
//             writeData(JSON.stringify(feat)+"\n")
        }
  }
  if ( feat.properties['@id'] == 40720629 ){
    console.warn(JSON.stringify(feat)+"\n")
  }
        
  });

//   var newIDs = new Set( newTiles.features.map(function(f){
//       newFeatures[f.properties['@id']] = f;
//       return f.properties['@id']}));
    
//   writeData(`${newTiles.features.length - newIDs.size} \n`)
    
//   var same;
//   var bigger;

//   if (currIDs.size==newIDs.size){
//       same = true;
//       for (var curID of currIDs){
//           if(!newIDs.has(curID)){
//              same = false;
//           }
//       }
//   }else{
//       same = false;
//       if (currIDs.size > newIDs.size){
//           bigger = 'current'
//       }else{
//           bigger = 'new'
//       }    
      
//       for(var currID of currIDs){
//           if (!newIDs.has(currID)){
//               missingInNew.push(curFeatures[currID]);
//           }
//       }


//       for(var newID of newIDs){
//           if (!currIDs.has(newID)){
//               missingInOld.push(newFeatures[newID]);
//           }
//       }
//   }
    
//   writeData(currentTiles.features.length + " " + newTiles.features.length + "\n");
  
  done(null, types); // {same: same, bigger: bigger, missingInNew: missingInNew, missingInOld: missingInOld});
};