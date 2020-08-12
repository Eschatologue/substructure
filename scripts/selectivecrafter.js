const sCrafter = extendContent(GenericCrafter, "selective-crafter", {
  load(){
    this.region = Core.atlas.find(this.name + "-icon");
    this.baseRegion = Core.atlas.find(this.name);
    this.inputRegion = [];
    this.outputRegion = [];
    for(var i = 1; i < 4; i++){
      this.inputRegion.push(Core.atlas.find(this.name + "-i-" + i));
      this.outputRegion.push(Core.atlas.find(this.name + "-o-" + i))
    }
  },

  generateIcons(){
    return [
      Core.atlas.find(this.name + "-i-1"),
      Core.atlas.find(this.name + "-o-1"),
      Core.atlas.find(this.name)
    ]
  },

  draw(tile){
    entity = tile.ent();
    front = tile.front();

    if(front.block() instanceof Conveyor){
      Draw.rect(this.outputRegion[Mathf.clamp(front.draw.frame, 0, this.outputRegion[0].length - 1)], tile.drawx(), tile.drawy());
    } /*else {
      Draw.rect(this.inputRegion[0], tile.drawx(), tile.drawy());
      Draw.rect(this.outputRegion[0], tile.drawx(), tile.drawy());
    }*/

    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
  },

  update(tile){
    entity = tile.ent();
    this.super$update(tile);
  }
});

sCrafter.size = 3;
sCrafter.hasItems = true;
sCrafter.hasPower = true;
sCrafter.requirements = ItemStack.with(Items.copper, 60, Items.lead, 40, Items.titanium, 35);
sCrafter.consumes.item(Items.sand, 1);
sCrafter.consumes.power(1.15);
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
