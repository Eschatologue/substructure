const cblock = name => Vars.content.block("substructure-" + name);
const cunit = name => Vars.content.getByName(ContentType.unit, "substructure-" + name);

module.exports = {
    /* region blocks */
    
    //turret
    configurableTurret: cblock("configurable-turret"),
    
    //defense
    perennialWall: cblock("perennial-wall"),
    perennialWallLarge: cblock("perennial-wall-large"),
    
    //logic
    blockPositionReader: cblock("block-position-reader"),
    blockRemover: cblock("block-remover"),
    unitSpawner: cblock("unit-spawner"),
    
    //experimental
    pbt1: cblock("phased-block-test-1"),
    pbt2: cblock("phased-block-test-2"),
    pbt3: cblock("phased-block-test-3"),
    
    /* end region */
    /* region units */
    
    carronade: cunit("carronade"),
    culverin: cunit("culverin")
};