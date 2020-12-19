const PhasedBlock = global.substructure.PhasedBlock;

const pbTest1 = new PhasedBlock(Block, "phased-block-test-1", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    consHealth: this.size * this.size * 20,
    consColor: Pal.accent,
    consPhases: 3,
}, Building, {});

const pbTest2 = new PhasedBlock(MessageBlock, "phased-block-test-2", {
    requirements: ItemStack.with(Items.copper, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    
    consHealth: this.size * this.size * 20,
    consColor: Pal.accent,
    consPhases: 3,
}, MessageBlock.MessageBuild, {
    updateTile(){
        this.super$updateTile();
        
        if(Mathf.chance(0.1)) Fx.burning.at(this.x, this.y);
    }
});