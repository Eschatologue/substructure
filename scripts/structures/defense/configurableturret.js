const fx = global.substructure.fx;
const f = global.substructure.func;

const laserBullet = extend(LaserBulletType, {
	init(b){
		if(!b) return;
		
		this.super$init(b);
		
		this.colors = b.owner.getColors();
	}
});
laserBullet.lifetime = 16;
laserBullet.hitSize = 4;
laserBullet.pierce = true;
laserBullet.damage = 110;
laserBullet.width = 25;
laserBullet.despawnEffect = Fx.none;
laserBullet.hitEffect = fx.chargeLaserHit;

const confTurret = extendContent(PowerTurret, "configurable-turret", {
	init(){
		this.super$init();
		
		f.setWIP(this);
	},
	
	load(){
		this.topRegion = Core.atlas.find(this.name + "-top");
		
		this.super$load();
	},
	
	icons(){
		return [
			Core.atlas.find(this.baseRegion),
			Core.atlas.find(this.region),
		];
	}
});
confTurret.size = 2;
confTurret.health = 1240;
confTurret.requirements = ItemStack.with(Items.copper, 65, Items.lead, 50, Items.graphite, 45, Items.silicon, 40);
confTurret.category = Category.turret;
confTurret.buildVisibility = BuildVisibility.shown;
confTurret.configurable = true;
confTurret.range = 160;
confTurret.chargeTime = 50;
confTurret.chargeMaxDelay = 25;
confTurret.chargeEffects = 7;
confTurret.shootType = laserBullet;
confTurret.recoil = 3;
confTurret.reloadTime = 75;
confTurret.cooldown = 0.03;
confTurret.powerUse = 3.5;
confTurret.shootShake = 2;
confTurret.shootEffect = fx.chargeLaserShoot;
confTurret.smokeEffect = fx.chargeLaserShootSmoke;
confTurret.chargeEffect = fx.chargeLaserCharge;
confTurret.chargeBeginEffect = fx.chargeLaserChargeBegin;
confTurret.heatColor = Pal.meltdownHit;
confTurret.targetAir = false;
confTurret.shootSound = Sounds.laser;
confTurret.buildType = () => {
	const ent = extendContent(PowerTurret.PowerTurretBuild, confTurret, {
		init(tile, team, shouldAdd, rotation){
			if(!this.initialized){
				this.create(tile.block(), team);
			}else{
				if(this.block.hasPower){
					this.power.graph = new PowerGraph();
					this.power.graph.add();
				};
			};
			this.rotation = rotation + 90;
			this.tile = tile;
			
			this.setColor(Color.valueOf("bf92f9"));
			
			this.set(tile.drawx(), tile.drawy());
			if(shouldAdd) this.add();
			
			this.created();
			return this;
		},
		
		draw(){
			var block = confTurret;
			
			this.super$draw();
			
			if(block.topRegion.found()){
				Draw.color(this.getColors()[1]);
				Draw.rect(block.topRegion, this.x + block.tr2.x, this.y + block.tr2.y, this.rotation - 90);
				
				Draw.color();
			};
		},
		
		buildConfiguration(table){
			table.button(Icon.fileText, () => {
				this.turretDialog();
			}).size(40);
		},
		
		shoot(ammo){
			var block = confTurret;
			var effectColor = this.getColors()[1];
			
			this.useAmmo();

			block.tr.trns(this.rotation, block.size * Vars.tilesize / 2);
			block.chargeBeginEffect.at(this.x + block.tr.x, this.y + block.tr.y, this.rotation, effectColor);

			for(var i = 0; i < block.chargeEffects; i++){
				Time.run(Mathf.random(block.chargeMaxDelay), () => {
					if(!this.isValid()) return;
					block.tr.trns(this.rotation, block.size * Vars.tilesize / 2);
					block.chargeEffect.at(this.x + block.tr.x, this.y + block.tr.y, this.rotation, effectColor);
				});
			};

			this.shooting = true;
			
			Time.run(this.block.chargeTime, () => {
				if(!this.isValid()) return;
				block.tr.trns(this.rotation, this.block.size * Vars.tilesize / 2);
				
				block.recoil = block.recoilAmount;
				this.heat = 1;
				this.bullet(ammo, this.rotation + Mathf.range(block.inaccuracy));
				this.effects();
				this.shooting = false;
			});
		},
		
		effects(){
			var block = confTurret;
			var effectColor = this.getColors()[1];
			
			block.shootEffect.at(this.x + block.tr.x, this.y + block.tr.y, this.rotation, effectColor);
			block.smokeEffect.at(this.x + block.tr.x, this.y + block.tr.y, this.rotation, effectColor);
			block.shootSound.at(this.tile, Mathf.random(0.9, 1.1));

			block.recoil = block.recoilAmount;
		},
		
		turretDialog(){
			var dialog = new BaseDialog("$dialog.name.turret-config");
			var cont = dialog.cont;
			
			cont.pane(p => {
				p.add("$excuse");
			});
			
			dialog.addCloseButton();
			dialog.show();
		},
		
		setColor(color){
			this._bulletColors = [color.cpy().mul(1, 1, 1, 0.4), color, Color.white];
		},
		
		getColors(){
			return this._bulletColors;
		}
	});
	return ent;
};
