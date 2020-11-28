this.global.substructure = {};

/* File "handler" */
const loadFiles = (files, directory) => {
	var loaded = "";
	for(var i in files){
		var file = files[i];
		
		this.global.substructure[file] = require("substructure/" + directory + "/" + file);
		//i + 1 == arr.length ? loaded += file + ".js " : loaded += file + ".js, ";
	};
	//print("Loaded " + loaded + "in the \`" + dir + "\` directory.");
}

var libraries = ["fx", "functions"];
loadFiles(libraries, "lib");

var contents = [
    //Nothing
    //"h",
	//Defense
	"perennialwalls", "configurableturret",
	//Utilities
	"unitspawner", "blockposreader", "blockremover"
];
	
loadFiles(contents, "substructures");
