const PhasedBlock = global.substructure.PhasedBlock;

const pbTest1 = new PhasedBlock(Block, "phased-block-test-1", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    consHealth: this.health / 4,
    consColor: Color.gray,
    consPhases: 2,
}, Building, {
    updateTile(){
        this.super$updateTile();
        
        if(Mathf.chance(0.14)) Fx.smoke.at(this.x + Mathf.range(5), this.y + Mathf.range(5));
    },
    
    draw(){
        Draw.color(Color.gray);
        Draw.rect(Blocks.sorter.region, this.x, this.y);
    }
});

const pbTest2 = new PhasedBlock(MessageBlock, "phased-block-test-2", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    consHealth: this.health / 4,
    consColor: Color.red,
    consPhases: 3,
}, MessageBlock.MessageBuild, {
    updateTile(){
        this.super$updateTile();
        
        if(Mathf.chance(0.1)) Fx.burning.at(this.x, this.y);
    },
    
    draw(){
        Draw.color(Color.red);
        Draw.rect(Blocks.router.region, this.x, this.y);
    }
});

const pbTest3 = new PhasedBlock(ItemTurret, "phased-block-test-3", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.turret,
    
    consHealth: this.health / 4,
    consColor: Color.white,
    consPhases: 4,
    
    cload(){
        this.region = Core.atlas.find("duo");
    },
    
    init(){
        this.super$init();
        
        this.ammo(Items.coal, Bullets.artilleryExplosive);
    }
}, ItemTurret.ItemTurretBuild, {});