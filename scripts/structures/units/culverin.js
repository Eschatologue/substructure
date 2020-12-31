const artilleryBullet = extend(ArtilleryBulletType, 2, 12, "shell", {
    knockback: 0.6,
    lifetime: 140,
    width: 14,
    height: 15,
    collides: true,
    collidesTiles: true,
    splashDamageRadius: 26,
    splashDamage: 52,
    
    frontColor: Pal.accent, backColor: Pal.accent.cpy(),
    hitEffect: Fx.blastExplosion,
    despawnEffect: Fx.blastExplosion
});

const largeArtillery = extend(Weapon, "substructure-large-artillery2", {
    x: 0, y: 0,
    rotate: true,
    rotateSpeed: 3,
    mirror: false,
    reload: 70,
    recoil: 2,
    shots: 3,
    shotDelay: 6,
    spacing: 4,
    shake: 2,
    
    ejectEffect: Fx.casing2,
    shootSound: Sounds.artillery,
    bullet: artilleryBullet
});

const culverin = extend(UnitType, "culverin", {
    speed: 0.37,
    hitSize: 14,
    health: 880,
    armor: 6,
    rotateSpeed: 2,
    mechFrontSway: 0.6,
    
    legLength: 15,
    flipBackLegs: false,
    
    load(){
        this.super$load();
        
        //temporary
        this.legRegion = UnitTypes.atrax.legRegion;
        this.legBaseRegion = UnitTypes.atrax.legBaseRegion;
        this.jointRegion = UnitTypes.atrax.jointRegion;
        this.footRegion = UnitTypes.atrax.footRegion;
    },
    
    init(){
        this.super$init();
        
        this.weapons.add(largeArtillery);
    }
});
culverin.defaultController = () => extend(GroundAI, {});
culverin.constructor = () => extend(LegsUnit, {});