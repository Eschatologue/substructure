const functions = this.global.substructure.functions;

const perennialWall = extend(Wall, "perennial-wall", {
    size: 1,
    category: Category.defense,
    buildVisibility: BuildVisibility.sandboxOnly,
    requirements: ItemStack.with(Items.coal, 2, Items.phaseFabric, 5),
    configurable: true,

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

const perennialWallLarge = extend(Wall, "perennial-wall-large", {
    size: 2,
    category: Category.defense,
    buildVisibility: BuildVisibility.sandboxOnly,
    requirements: ItemStack.mult(perennialWall.requirements, 4),
    configurable: true,

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
