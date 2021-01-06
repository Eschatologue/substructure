const fx = this.global.substructure.fx;

const artilleryExplosive = extend(ArtilleryBulletType, 5.2, 940, "shell", {
    knockback: 1.4,
    lifetime: 240,
    width: 24,
    height: 25,
    collides: true,
    collidesTiles: true,
    makeFire: true,
    
    incendAmount: 12,
    incendSpread: 24,
    splashDamageRadius: 56,
    splashDamage: 770,
    
    frontColor: Pal.accent, backColor: Pal.accent.cpy(),
    shootEffect: Fx.shootBig2,
    smokeEffect: Fx.shootBigSmoke2,
    hitEffect: Fx.massiveExplosion,
    despawnEffect: Fx.massiveExplosion
});

const giantArtillery = extend(Weapon, "substructure-giant-artillery", {
    x: 0, y: 0,
    shootY: 7,
    rotate: true,
    rotateSpeed: 3,
    mirror: false,
    reload: 120,
    recoil: 7,
    shots: 1,
    shake: 5,
 
    ejectEffect: Fx.casing4,
    shootSound: Sounds.artillery,
    bullet: artilleryExplosive
});


const serpentine = extend(UnitType, "serpentine", {
    drag: 0.04,
    speed: 0.55,
    hitSize: 22,
    health: 24000,
    armor: 18,
    
    rotateSpeed: 1.4,
    
    flipBackLegs: false,
    legLength: 75,
    legMoveSpace: 0.8,
    legPairOffset: 3,
    legExtension: -20,
    legBaseOffset: 8,
    landShake: 1.3,
    legLengthScl: 0.93,
    rippleScale: 3,
    legSpeed: 0.19,
    
    hovering: true,
    allowLegStep: true,
    visualElevation: 0.98,
    groundLayer: Layer.legUnit,
    
    load(){
        this.super$load();
        
        //temporary
        this.legRegion = UnitTypes.toxopid.legRegion;
        this.legBaseRegion = UnitTypes.toxopid.legBaseRegion;
        this.jointRegion = UnitTypes.toxopid.jointRegion;
        this.footRegion = UnitTypes.toxopid.footRegion;
    },
    
    init(){
        this.super$init();
        
        this.weapons.add(giantArtillery);
    }
});
serpentine.defaultController = () => extend(GroundAI, {});
serpentine.constructor = () => extend(LegsUnit, {
    killed(){
        fx.incendiaryCharge.at(this.x, this.y, this.rotation, this);
        Time.run(fx.incendiaryCharge.lifetime, () => Damage.dynamicExplosion(this.x, this.y, 0.4, 4.8, 24, 48, true));
        
        this.health = 0;
        this.dead = true;
    }
});