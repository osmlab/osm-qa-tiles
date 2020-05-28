const readline = require('readline');
const area = require('@turf/area').default;

const rl = readline.createInterface({
  input: process.stdin
});

var invalid = 0;
var feat
var featsProcessed = 0;
rl.on('line', (input) => {
   try{
       if (input.endsWith(",") ){
            feat = JSON.parse(input.substring(0, input.length-1));
       }else{
           feat = JSON.parse(input)
       }
       
       featsProcessed++
       if (featsProcessed%10000==0){
           process.stderr.write("\r"+(featsProcessed/1000000).toFixed(2)+"M features processed") 
       }

       if (feat.properties && ((feat.properties.natural === 'coastline') || parseInt(feat.properties.admin_level || 9) < 2))
        	return;
    	else if  (feat.geometry && ((feat.geometry.type === 'Polygon') || (feat.geometry.type === 'MultiPolygon')) && area(feat) > 6.475E7) // approx 25 mi^2
        	return;
    	else
        	process.stdout.write(input + '\n');
       
	}catch(e){
        invalid++;
        if (invalid>1000) throw e
    }
//        process.stderr.write(JSON.stringify(e)
//		invalid++;
// 		process.stderr.write("\r"+invalid);
});
