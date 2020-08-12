const displayVault = extendContent(Vault, "display-vault", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find(this.name + "-top");
  },

  generateIcons(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ]
  },

  draw(tile){
    entity = tile.ent();

    Draw.rect(this.region, tile.drawx(), tile.drawy());
    entity.items.total() > 0 ? Draw.rect(entity.items.first().icon(Cicon.large), tile.drawx(), tile.drawy(), Vars.itemSize, Vars.itemSize) : Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  }
});

displayVault.size = 3;
displayVault.health = 360;
displayVault.hasItems = true;
displayVault.itemCapacity = 1500;
displayVault.requirements = ItemStack.with(Items.titanium, 250, Items.thorium, 125);
displayVault.category = Category.effect;
displayVault.buildVisibility = BuildVisibility.shown;
