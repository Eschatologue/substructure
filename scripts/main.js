this.global.substructure = {};

/* File "handler" */
function loadFile(array, dir){
	for(var file of array){
		this.global.substructure[file] = require("substructure/" + dir + "/" + file);
		print("Loaded " + file + ".js in substructure/" + dir);
	}
}

var libraries = ["fx"];
loadFile(libraries, "lib");

var turrets = ["chargeturret"];
loadFile(turrets, "turrets");

var units = ["shieldunit"];
loadFile(units, "units");
