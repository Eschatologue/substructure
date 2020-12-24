const extendf = global.substructure.func.extendf;

const bPReader = extendf(Block, "block-position-reader", {
    requirements: ItemStack.with(Items.copper, 2, Items.lead, 4),
    buildVisibility: BuildVisibility.shown,
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

        table.button(Icon.commandRally, () => {
            this.configure("X: " + (this.x / 8) + " Y: " + (this.y / 8));
        }).size(40);
        table.button(Icon.up, () => {
            otherPosEnt == null ? this.configure("X: " + (otherPos.getX() / 8) + " Y: " + (otherPos.getY() / 8)) : this.configure("X: " + (otherPosEnt.getX() / 8) + " Y: " + (otherPosEnt.getY() / 8));
        }).size(40);
    }
});
