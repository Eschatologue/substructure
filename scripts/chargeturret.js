const fx = require("fx");

const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.white];
const tscales = [1, 0.7, 0.5, 0.2];
const lenscales = [1, 1.12, 1.15, 1.17];

const laserBullet = extend(BasicBulletType, {
	update(b){
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.laserLength);
		}
	},

	draw(b){
		f = Mathf.curve(b.fin(), 0, 0.2);
		baseLen = this.laserLength * f;

		Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
   	for(s = 0; s < 3; s++){
    	Draw.color(colors[s]);
    	for(i = 0; i < tscales.length; i++){
      	Lines.stroke(7 * b.fout() * (s == 0 ? 1.5 : s == 1 ? 1 : 0.3) * tscales[i]);
        Lines.lineAngle(b.x, b.y, b.rot(), baseLen * lenscales[i]);
     	}
   	}
		Draw.reset();
	}
});

laserBullet.lifetime = 16;
laserBullet.hitSize = 4;
laserBullet.pierce = true;
laserBullet.damage = 110;
laserBullet.despawnEffect = Fx.none;
laserBullet.hitEffect = fx.chargeLaserHit;
laserBullet.laserLength = 170;

const chargeTurret = extendContent(ChargeTurret, "charge-turret", {});

chargeTurret.size = 2;
chargeTurret.health = 1240;
chargeTurret.requirements(Category.turret, ItemStack.with(Items.copper, 65, Items.lead, 50, Items.graphite, 45, Items.silicon, 40));
chargeTurret.range = 160;
chargeTurret.chargeTime = 50;
chargeTurret.chargeMaxDelay = 25;
chargeTurret.chargeEffects = 7;
chargeTurret.shootType = laserBullet;
chargeTurret.recoil = 3;
chargeTurret.reload = 75;
chargeTurret.cooldown = 0.03;
chargeTurret.powerUse = 3.5;
chargeTurret.shootShake = 2;
chargeTurret.shootEffect = fx.chargeLaserShoot;
chargeTurret.smokeEffect = fx.chargeLaserShootSmoke;
chargeTurret.chargeEffect = fx.chargeLaserCharge;
chargeTurret.chargeBeginEffect = fx.chargeLaserChargeBegin;
chargeTurret.heatColor = Pal.meltdownHit;
chargeTurret.targetAir = false;
chargeTurret.shootSound = Sounds.laser;
