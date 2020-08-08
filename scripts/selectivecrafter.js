const sCrafter = extendContent(GenericCrafter, "selective-crafter", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.convRegion = [];
    for(i = 0; i < 3; i++){
      this.convRegion.push(Core.atlas.find(this.name + "-conv-" + i));
    }
  },

  draw(tile){
    entity = tile.ent();

    Draw.rect(this.region, tile.drawx(), tile.drawy(), tile.rotation());
    Draw.rect(this.convRegion[entity.getConv()], tile.drawx(), tile.drawy(), tile.rotation());
    if(entity.liquids.amount() > 0.001){
      Draw.color(entity.liquids.current().color);
      Draw.alpha(entity.liquids.total() / this.liquidCapacity);
      Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy(), tile.rotation());
      Draw.color();
    }
  },

  update(tile){
    this.super$update(tile);
    entity = tile.ent();

    if(entity.timer.get(this.convTimer, 3)) entity.setConv(entity.getConv() + 1);
    if(entity.getConv() == this.convRegion.length) entity.setConv(0);
  }
});

sCrafter.size = 3;
sCrafter.hasLiquids = true;
sCrafter.hasItems = true;
sCrafter.hasPower = true;
sCrafter.requirements = ItemStack.with(Items.copper, 60, Items.lead, 40, Items.titanium, 35);
sCrafter.consumes.item(Items.sand, 1);
sCrafter.consumes.power(1.15);
sCrafter.consumes.liquid(Liquids.water, 0.6);
sCrafter.category = Category.crafting;
sCrafter.buildVisibility = BuildVisibility.shown;
sCrafter.convTimer = sCrafter.timers++;

sCrafter.entityType = prov(() => {
  const entity = extend(GenericCrafter.GenericCrafterEntity, {
    getConv(){
      return this._conv;
    },

    setConv(int){
      this._conv = int;
    }
  });
  entity.setConv(0);
  return entity;
});
