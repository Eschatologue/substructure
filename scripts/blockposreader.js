const bPReader = extendContent(MessageBlock, "block-position-reader", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find(this.name + "-top");
  },

  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy(), tile.rotation() * 90);
  },

  configured(tile, player, value){
    set = [
      (tile, player) => Call.setMessageBlockText(null, tile, tile.x + ", " + tile.y),
      (tile, player) => Call.setMessageBlockText(null, tile, tile.front().x + ", " + tile.front().y)
    ];

    set[value](tile, player);
  },

  buildConfiguration(tile, table){
    table.addImageButton(Icon.commandRally, Styles.clearTransi, run(() => {
      tile.configure(0);
    })).size(50);

    table.addImageButton(Icon.up, Styles.clearTransi, run(() => {
      tile.configure(1);
    })).size(50);
  }
});

bPReader.size = 1;
bPReader.category = Category.effect;
bPReader.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
bPReader.buildVisibility = BuildVisibility.shown;
bPReader.rotate = true;
