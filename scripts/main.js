this.global.substructure = {};

/* File "handler" */
const loadFiles = (arr, dir) => {
	var loaded = "";
	for(var i in arr){
		var file = arr[i];

		this.global.substructure[file] = require("substructure/" + dir + "/" + file);
		//i + 1 == arr.length ? loaded += file + ".js " : loaded += file + ".js, ";
	}
	//print("Loaded " + loaded + "in the \`" + dir + "\` directory.");
}

var libraries = ["fx"];
loadFiles(libraries, "lib");

var logic = ["unitspawner", "blockposreader", "blockremover"];
loadFiles(logic, "logic");

var defense = ["perennialwalls"];
loadFiles(defense, "defense");

var turret = ["chargeturret"];
loadFiles(turret, "turret");

var units = ["shieldunit"];
loadFiles(units, "units");

print("Successfully loaded all files in Gdeft/substructure.")