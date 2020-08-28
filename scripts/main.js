/* File "handler" */
function loadFile(array, dir){
	for(var file of array){
		require("substructure/" + dir + "/" + file);
		print("Successfully loaded " + file + ".js");
	}
}

var turrets = ["chargeturret", "chargeturretii"];
loadFile(turrets, "turrets");

var units = ["shieldunit"];
loadFile(units, "units");
