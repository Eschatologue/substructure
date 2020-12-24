const extendf = global.substructure.func.extendf;

const bRemover = extendf(Block, "block-remover", {
    requirements: ItemStack.with(Items.copper, 2, Items.lead, 4),
    buildVisibility: BuildVisibility.sandboxOnly,
    category: Category.logic,

    health: 40,
    size: 1,
    configurable: true,
    rotate: true,
    solid: true,

    load(){
        this.super$load();
        
        this.baseRegion = Core.atlas.find("substructure-base");
    },
    
    icons(){
        return [this.baseRegion, this.region];
    }
}, Building, {
    draw(){
        Draw.rect(this.blockf().baseRegion, this.x, this.y);
        Draw.rect(this.block.region, this.x, this.y, this.rotdeg());
    },
    
    buildConfiguration(table){
        let otherPos = this.tile.nearby(this.rotation);
        let otherPosEnt = this.tile.nearbyBuild(this.rotation);

        table.button(Icon.hammer, () => {
            if(otherPosEnt != null && otherPosEnt instanceof Healthc){
                otherPosEnt.kill();
            };
        });
    }
});
