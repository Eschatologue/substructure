const smallMissle = extend(MissileBulletType, 1.6, 12, {
    lifetime: 70,
    homingRange: 60,
    splashDamageRadius: 20,
    splashDamage: 25,
    makeFire: true,
    
    frontColor: Pal.accent, backColor: Pal.accent.cpy(),
    hitEffect: Fx.blastExplosion,
    despawnEffect: Fx.blastExplosion
});

const missileLauncher = extend(Weapon, {
    x: 0,
    y: 4,
    reload: 30,
    rotate: false,
    ejectEffect: Fx.casing1,
    bullet: smallMissle
});

const carronade = extend(UnitType, "carronade", {
    speed: 0.4,
    hitSize: 9,
    health: 400,
    range: 80,

    init(){
        this.super$init();
        
        this.weapons.add(missileLauncher);
    }
});
carronade.defaultController = () => extend(GroundAI, {});
carronade.constructor = () => extend(MechUnit, {});