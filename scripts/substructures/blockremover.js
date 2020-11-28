const bRemover = extend(MessageBlock, "block-remover", {
    size: 1,
    category: Category.logic,
    buildVisibility: BuildVisibility.sandboxOnly,
    requirements: ItemStack.with(Items.copper, 2, Items.lead, 4),
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
bRemover.buildType = () => {
    const ent = extendContent(MessageBlock.MessageBuild, bRemover, {
        draw(){
            Draw.rect(bRemover.region, this.x, this.y);
            Draw.rect(bRemover.topRegion, this.x, this.y, this.rotdeg());
        },

        buildConfiguration(table){
            var otherPos = this.tile.getNearby(this.rotation);
            var otherPosEnt = this.tile.getNearbyEntity(this.rotation);

            table.button(Icon.hammer, () => {
                if(otherPosEnt != null && otherPosEnt instanceof Healthc){
                    otherPosEnt.kill();
                    this.configure("Removed a building in X: " + (otherPosEnt.getX() / 8) + " Y: " + (otherPosEnt.getY() / 8));
                }else{
                    this.configure("Cannot find building in X: " + (otherPos.getX() / 8) + " Y: " + (otherPos.getY() / 8));
                };
            });
        },

        placed(){
            this.super$placed();

            this.configure("...");
        }
    });
    return ent;
};
