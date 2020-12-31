const fx = global.substructure.fx;
const sfx = global.substructure.sfx;

const explosive = extend(BombBulletType, 0, 0, "clear", {
    lifetime: 10,
    splashDamageRadius: 130,
    splashDamage: 240,
    speed: 1,
    hittable: false,
    makeFire: true,
    collidesAir: true,
    killShooter: true,
    instantDisappear: true,
    keepVelocity: true,
    
    frontColor: Pal.accent, backColor: Pal.accent.cpy(),
    shootEffect: fx.carronadeCharge,
    hitEffect: Fx.blastExplosion,
    despawnEffect: Fx.blastExplosion,

    fragBullet: Bullets.fireball,
    fragBullets: 10
});

const selfDestruct = extend(Weapon, {
    x: 0, y: 0,
    mirror: false,
    reload: 280,
    shootCone: 180,
    shake: 8,
    firstShotDelay: fx.carronadeCharge.lifetime,
    
    shootStatus: sfx.boost,
    shootStatusDuration: 60 * 3,
    shootSound: Sounds.explosion,
    ejectEffect: Fx.none,
    bullet: explosive
});

const carronade = extend(UnitType, "carronade", {
    speed: 0.4,
    hitSize: 9,
    health: 420,
    range: 60,
    mechSideSway: 0.3,

    init(){
        this.super$init();

        this.weapons.add(selfDestruct);
    }
});
carronade.defaultController = () => extend(SuicideAI, {});
carronade.constructor = () => extend(MechUnit, {});