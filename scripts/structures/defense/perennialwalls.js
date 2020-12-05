const functions = this.global.substructure.functions;

const perennialWall = extend(Wall, "perennial-wall", {
    configurable: true,
    category: Category.defense,
    requirements: ItemStack.with(Items.coal, 2, Items.phaseFabric, 5),
    buildVisibility: BuildVisibility.sandboxOnly,

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
perennialWall.buildType = () => extend(Wall.WallBuild, perennialWall, {
	buildConfiguration(table){
        table.button(Icon.up, () => {
            this.configure(0);
        }).size(40);
    },

    configured(player, value){
        if(value == 0) this.team = Team.get((this.team.id + 1) > 5 ? 0 : this.team.id + 1);
    },
		
    damage(damage){
        //indestructible, useless.
    },
            
    handleDamage(amount){
        return 0;
    }
});

const perennialWallLarge = extend(Wall, "perennial-wall-large", {
    configurable: true,
    category: Category.defense,
    requirements: ItemStack.with(Items.coal, 2, Items.phaseFabric, 5),
    buildVisibility: BuildVisibility.sandboxOnly,

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
perennialWallLarge.buildType = () => extend(Wall.WallBuild, perennialWallLarge, {
	buildConfiguration(table){
        table.button(Icon.up, () => {
            this.configure(0);
        }).size(40);
    },

    configured(player, value){
        if(value == 0) this.team = Team.get((this.team.id + 1) > 5 ? 0 : this.team.id + 1);
    },
		
    damage(damage){
        //indestructible, useless.
    },
            
    handleDamage(amount){
        return 0;
    }
});
