this.global.substructure = {};
const category = ["campaign", "defense", "logic", "units"];

Vars.enableConsole = true;

/* File "handler" */
const loadFiles = (contents, directory, mult) => {
    let loaded = "";
    let file, path;
    
    if(mult){
        for(let i in contents){
            let cat = contents[i];
            loaded = "";
            
            for(let j in cat){
                file = cat[j];
                path = directory + "/" + category[i] + "/";
                
                this.global.substructure[file] = require("substructure/" + path + file);
                file == cat[cat.length - 1] ? loaded += file + ".js " : loaded += file + ".js, ";
            };
            print("Loaded " + loaded + "from the \'" + path + "\` directory.");
        };
    }else{
        for(let i in contents){
            let file = contents[i];
            
            this.global.substructure[file] = require("substructure/" + directory + "/" + file);
            file == contents[contents.length - 1] ? loaded += file + ".js " : loaded += file + ".js, ";
        };
        print("Loaded " + loaded + "from the \`" + directory + "\` directory.");
    };
};

const libraries = ["fx", "sfx", "functions"];
const experimental = [""];
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

loadFiles(libraries, "lib");
loadFiles(content, "structures", true);
