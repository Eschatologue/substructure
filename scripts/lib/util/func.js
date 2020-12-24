const funcs = {
    setWIP: content => {
        content.description = Core.bundle.get("excuse2") + Core.bundle.get(content.getContentType() + "." + content.name + ".description");
    },
    
    clone: object => {
        let c = {};
        for(var i in object){
            (typeof(object[i]) == "object" && object[i] != null) ? c[i] = clone(object[i]) : c[i] = object[i];
        };

        return c;
    },

    extendf: (classType, name, classObject, build, buildObject) => {
        Log.info(classType + " | " + name + ": " + Object.keys(classObject).toString());
        Log.info(build + " | " + name + ": " + Object.keys(buildObject).toString());
        
        const block = extend(classType, name, classObject);
        block.update = true;
        
        buildObject = Object.assign({
            blockf(){
                return block;
            }
        }, buildObject);
        build == Building ? block.buildType = () => extend(build, funcs.clone(buildObject)) : block.buildType = () => extend(build, block, funcs.clone(buildObject));
    }
};

module.exports = funcs;