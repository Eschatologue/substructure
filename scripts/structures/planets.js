const planetGen = this.global.substructure.planetgen;

//why is there a large gap between 3 and 4
const detritus = extend(Planet, "detritus", Planets.sun, 3, 1, {});
detritus.generator = planetGen.detritus;
detritus.meshLoader = () => new HexMesh(detritus, 6);
detritus.atmosphereColor = Color.valueOf("5b4738");
detritus.atmosphereRadIn = -0.003;
detritus.atmosphereRadOut = 0.37;
detritus.startSector = 10;

module.exports = {
    detritus: detritus
};