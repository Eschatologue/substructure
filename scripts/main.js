global.substructure = {};

const cl = ["content", "util", "world"];
const cc = ["defense", "production", "logic", "units", "experimental", "campaign"];

Vars.enableConsole = true;
Vars.experimental = true;

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
                
            global.substructure[file] = require("substructure/" + path + file);
            file == cat[cat.length - 1] ? loaded += file + ".js " : loaded += file + ".js, ";
        };
        Log.info("Loaded " + loaded + "from the [accent]\'" + path + "\'[] directory.");
    };
};

const libraries = [
    //Content
    ["fx", "sfx"],
    
    //Utilities
    ["func"],
    
    //World
    ["PhasedBlock"]
];
const content = [
    //Defense
    ["perennialwalls", "configurableturret"],
    
    //Production
    ["tradingpost"],
    
    //Logic
    ["unitspawner", "blockposreader", "blockremover"],
    
    //Units
    ["carronade", "culverin", "serpentine"],
    
    //Experimental
    ["phasedblocktest"],
    
    //Campaign
    ["content", "planetgen", "planets", "sectors", "techtree"]
];

loadFiles(libraries, "lib", cl);
loadFiles(content, "structures", cc);
