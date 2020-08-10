const pJunction = extendContent(Junction, "power-junction", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.powerRegion = Core.atlas.find(this.name + "-power");
  }
});

pJunction.size = 2;
pJunction.capacity = 24;
pJunction.speed = 26;
pJunction.health = 60;
pJunction.buildCostMultiplier = 6;
pJunction.requirements = ItemStack.with(Items.copper, 4, Items.lead, 16);
pJunction.category = Category.distribution;
