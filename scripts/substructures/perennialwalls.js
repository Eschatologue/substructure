const functions = this.global.substructure.functions;

const perennialWall = extendContent(Wall, "perennial-wall", {
	init(){
		this.super$init();
		
		functions.setWIP(this);
	},

	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.health);
		this.stats.add(BlockStat.health, "Infinite");
	}
});
perennialWall.size = 1;
perennialWall.health = 1;
perennialWall.configurable = true;
perennialWall.category = Category.defense;
perennialWall.requirements = ItemStack.with(Items.coal, 2, Items.phasefabric, 5);
perennialWall.buildVisibility = BuildVisibility.sandboxOnly;
perennialWall.buildType = () => {
	const ent = extendContent(Wall.WallBuild, perennialWall, {
		buildConfiguration(table){
			table.button(Icon.up, () => {
				this.configure(0);
			}).size(40);
		},

		configured(player, value){
			if(value == 0) this.team = Team.get((this.team.id + 1) > 5 ? 0 : this.team.id + 1);
		},
		
		damage(damage){
			//Indestructible, useless.
		},
		
		handleDamage(amount){
			return 0;
		}
	});
	return ent;
};

const perennialWallLarge = extendContent(Wall, "perennial-wall-large", {
	init(){
		this.super$init();
		
		functions.setWIP(this);
	},
	
	setStats(){
		this.super$setStats();
		
		this.stats.remove(BlockStat.health);
		this.stats.add(BlockStat.health, "Infinite");
	}
});
perennialWallLarge.size = 2;
perennialWallLarge.health = 1;
perennialWallLarge.configurable = true;
perennialWallLarge.category = Category.defense;
perennialWallLarge.requirements = ItemStack.mult(perennialWall.requirements, 4);
perennialWallLarge.buildVisibility = BuildVisibility.sandboxOnly;
perennialWallLarge.buildType = () => {
	const ent = extendContent(Wall.WallBuild, perennialWallLarge, {
		buildConfiguration(table){
			table.button(Icon.up, () => {
				this.configure(0);
			}).size(40);
		},

		configured(player, value){
			if(value == 0) this.team = Team.get((this.team.id + 1) > 5 ? 0 : this.team.id + 1);
		},
		
		damage(damage){
			//Indestructible, useless.
		},
		
		handleDamage(amount){
			return 0;
		}
	});
	return ent;
};
