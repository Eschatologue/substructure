const bHReader = extendContent(MessageBlock, "block-health-reader", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find(this.name + "-top");
  },

  buildConfiguration(tile, table){

  },

  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy(), tile.rotation() * 90);
  },

  update(tile){
    entity = tile.ent();

    this.super$update(tile);
    Call.setMessageBlockText(null, tile, tile.front().ent().health());
  }
});

bHReader.size = 1;
bHReader.category = Category.effect;
bHReader.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
bHReader.buildVisibility = BuildVisibility.shown;
bHReader.rotate = true;
