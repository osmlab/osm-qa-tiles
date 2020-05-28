const area = require('@turf/area').default;

module.exports = function(input, writeData, done) {  

  var feat;  
  var keep = true;
  var skipped = 0;
  var error = 0;
    
  try{
    
    //Starts with a record separator?
    if (input.startsWith("\x1e")){
      feat = JSON.parse(input.substring(1,input.length))
    }
    
    //Or if it's part of a feature collection
    else if (input.endsWith(",") ){ 
      feat = JSON.parse(input.substring(0, input.length-1));
    
    }else{
      feat = JSON.parse(input.trim())
    }
      
  }catch(e){
    error++;
    keep = false;
  }
    
  if (feat){
   
      // Filter script (original logic by Tom Lee) to test out more 'compact' tilesets
      //First: if it's a coastline or has an admin_level <2, skip it
      if (feat.properties && ((feat.properties.natural === 'coastline') || parseInt(feat.properties.admin_level || 9) < 2)){
        keep = false;
      }

      //Second, throw out all polygons that are greater than 25 km^2
      else if (feat.geometry && (
          (feat.geometry.type === 'Polygon') || (feat.geometry.type === 'MultiPolygon')) && area(feat) > 6.475E7){      
         keep = false;
      }
      //Could do more here if desired


      if (keep){
        writeData(input + "\n");
      }else{
        skipped++
      }
  }
      
  done(null, [skipped,error]);

};