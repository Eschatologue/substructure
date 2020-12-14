const planets = global.substructure.planets;

/* Detritus */
const scrapyard = new SectorPreset("scrapyard", planets.detritus, 10);
scrapyard.captureWave = 10;
scrapyard.alwaysUnlocked = true;

module.exports = {
    scrapyard: scrapyard
};
