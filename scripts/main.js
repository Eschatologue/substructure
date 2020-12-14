this.global.substructure = {};

const cl = ["content", "util", "signal-logic"];
const cc = ["campaign", "defense", "logic", "units"];

Vars.enableConsole = true;

/* File "handler" */
const loadFiles = (contents, directory, category) => {
    let loaded = "";
    let file, path;

    for(let i in contents){
        let cat = contents[i];
        loaded = "";
            
        for(let j in cat){
            file = cat[j];
            path = directory + "/" + category[i] + "/";
                
            this.global.substructure[file] = require("substructure/" + path + file);
            file == cat[cat.length - 1] ? loaded += file + ".js " : loaded += file + ".js, ";
        };
        Log.info("Loaded " + loaded + "from the [accent]\'" + path + "\`[] directory.");
    };
};

const libraries = [
    //Content
    ["fx", "sfx"],
    
    //Utilities
    ["func"],
    
    //Signal-logic
    ["logicblock"]
];
const content = [
    //Campaign
    ["planetgen", "planets", "sectors"],
    
    //Defense
    ["perennialwalls", "configurableturret"],
    
    //Logic
    ["unitspawner", "blockposreader", "blockremover"],
    
    //Units
    ["carronade", "culverin"]
];

loadFiles(libraries, "lib", cl);
loadFiles(content, "structures", cc);
