const bPReader = extend(MessageBlock, "block-position-reader", {
    requirements: ItemStack.with(Items.copper, 2, Items.lead, 4),
    buildVisibility: BuildVisibility.shown,
    category: Category.logic,
    configurable: true,
    rotate: true,
    
    load(){
        this.region = Core.atlas.find(this.name);
        this.topRegion = Core.atlas.find(this.name + "-top");
    },

    icons(){
        return [
            Core.atlas.find(this.region),
            Core.atlas.find(this.topRegion)
        ];
    }
});
bPReader.buildType = () => extend(MessageBlock.MessageBuild, bPReader, {
    draw(){
        Draw.rect(bPReader.region, this.x, this.y);
        Draw.rect(bPReader.topRegion, this.x, this.y, this.rotdeg());
    },

    buildConfiguration(table){
        let otherPos = this.tile.getNearby(this.rotation);
        let otherPosEnt = this.tile.getNearbyEntity(this.rotation);

        table.button(Icon.commandRally, () => {
            this.configure("X: " + (this.x / 8) + " Y: " + (this.y / 8));
        }).size(40);
        table.button(Icon.up, () => {
            otherPosEnt == null ? this.configure("X: " + (otherPos.getX() / 8) + " Y: " + (otherPos.getY() / 8)) : this.configure("X: " + (otherPosEnt.getX() / 8) + " Y: " + (otherPosEnt.getY() / 8));
        }).size(40);
    },
    
    placed(){
        this.super$placed();

        this.configure("...");
    }
});
