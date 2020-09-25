const fx = this.global.substructure.fx;

const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.white];
const tscales = [1, 0.7, 0.5, 0.2];
const lenscales = [1, 1.12, 1.15, 1.17];

const laserBullet = extend(BasicBulletType, {
	update(b){
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, b.rotation(), this.laserLength);
		}
	},

	draw(b){
		var f = Mathf.curve(b.fin(), 0, 0.2);
		var baseLen = this.laserLength * f;

		Lines.lineAngle(b.x, b.y, b.rotation(), baseLen);
   	    for(var s = 0; s < 3; s++){
			Draw.color(colors[s]);
			for(var i = 0; i < tscales.length; i++){
				Lines.stroke(7 * b.fout() * (s == 0 ? 1.5 : s == 1 ? 1 : 0.3) * tscales[i]);
        		Lines.lineAngle(b.x, b.y, b.rotation(), baseLen * lenscales[i]);
     	    }
		}
		Drawf.light(Team.derelict, b.x, b.y, b.x + Tmp.v1.x, b.y + Tmp.v1.y, 15f * b.fout(), colors[0], 0.6f);
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
chargeTurret.requirements = ItemStack.with(Items.copper, 65, Items.lead, 50, Items.graphite, 45, Items.silicon, 40);
chargeTurret.category = Category.turret;
chargeTurret.buildVisibility = BuildVisibility.shown;
chargeTurret.range = 160;
chargeTurret.chargeTime = 50;
chargeTurret.chargeMaxDelay = 25;
chargeTurret.chargeEffects = 7;
chargeTurret.shootType = laserBullet;
chargeTurret.recoil = 3;
chargeTurret.reloadTime = 75;
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
