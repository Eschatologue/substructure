//WIP: ~~May not be continued~~
const sCrafter = extendContent(GenericCrafter, "selective-crafter", {
  load(){
    this.region = Core.atlas.find(this.name + "-icon");
    this.baseRegion = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.convRegion = [];
    for(i = 1; i < 4; i++){
      this.convRegion.push(Core.atlas.find(this.name + "-conv-" + i))
    }
  },

  draw(tile){
    entity = tile.ent();

    Draw.rect(this.convRegion[Math.floor(Mathf.absin(entity.totalProgress, 5, 2.999))], tile.drawx(), tile.drawy());
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    if(entity.liquids.total() > 0.001){
      Draw.color(entity.liquids.current().color);
      Draw.alpha(entity.liquids.total() / this.liquidCapacity);
      Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
      Draw.color();
    }
  },

  update(tile){
    entity = tile.ent();
    this.super$update(tile);
  }
});

sCrafter.size = 3;
sCrafter.hasLiquids = true;
sCrafter.hasItems = true;
sCrafter.hasPower = true;
sCrafter.requirements = ItemStack.with(Items.copper, 60, Items.lead, 40, Items.titanium, 35);
sCrafter.consumes.item(Items.sand, 1);
sCrafter.consumes.power(1.15);
sCrafter.consumes.liquid(Liquids.water, 0.06);
sCrafter.outputItem = new ItemStack(Items.scrap, 1);
sCrafter.category = Category.crafting;
sCrafter.buildVisibility = BuildVisibility.shown;
sCrafter.frameTimer = sCrafter.timers++;

sCrafter.entityType = prov(() => {
  const entity = extend(GenericCrafter.GenericCrafterEntity, {
    //TODO fail
  });
  return entity;
});
