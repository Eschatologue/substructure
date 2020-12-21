const PhasedBlock = global.substructure.PhasedBlock;
const fx = global.substructure.fx;

const pbTest1 = new PhasedBlock(Block, "phased-block-test-1", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    builtPhaseEffect: fx.phaseFinished,
    builtEffect: fx.consFinished,
    consHealth: this.health / 4,
    consPhases: 5,
}, Building, {
    draw(){
        Draw.color(Color.gray);
        Draw.rect(Blocks.sorter.region, this.x, this.y);
    }
});

const pbTest2 = new PhasedBlock(MessageBlock, "phased-block-test-2", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    builtPhaseEffect: fx.phaseFinished,
    builtEffect: fx.consFinished,
    consHealth: this.health / 4,
    consPhases: 3,
}, MessageBlock.MessageBuild, {
    draw(){
        Draw.color(Color.red);
        Draw.rect(Blocks.router.region, this.x, this.y);
    }
});

const pbTest3 = new PhasedBlock(ItemTurret, "phased-block-test-3", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.turret,
    
    builtPhaseEffect: fx.phaseFinished,
    builtEffect: fx.consFinished,
    consHealth: this.health / 4,
    consPhases: 4,
    
    cload(){
        this.region = Core.atlas.find("duo");
    },
    
    init(){
        this.super$init();
        
        this.ammo(Items.coal, Bullets.artilleryExplosive);
    }
}, ItemTurret.ItemTurretBuild, {});