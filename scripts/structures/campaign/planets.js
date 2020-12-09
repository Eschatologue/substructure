const planetGen = this.global.substructure.planetgen;

//why is there a large gap between 3 and 4
const detritus = extend(Planet, "detritus", Planets.sun, 3, 1, {});
detritus.generator = planetGen.detritus;
detritus.meshLoader = () => new HexMesh(detritus, 6);
detritus.atmosphereColor = Color.valueOf("5b4738");
detritus.atmosphereRadIn = 0.003;
detritus.atmosphereRadOut = 0.37;
detritus.startSector = 10;

const cultch = extend(Planet, "cultch", detritus, 0, 0.32, {});
cultch.atmosphereColor = Color.valueOf("5b4738");
cultch.atmosphereRadIn = 0.03;
cultch.accessible = false;
cultch.meshLoader = () => new SunMesh(cultch, 3,
    5, 0.3, 1.7, 1.2, 1,
    1.1,
    Color.valueOf("1a1a1a"),
    Color.valueOf("080808"),
    Color.valueOf("0c0c0c"),
    Color.valueOf("141414"),
    Color.valueOf("121212"),
    Color.valueOf("1d1d1d")
);

module.exports = {
    detritus: detritus,
    cultch: cultch
};