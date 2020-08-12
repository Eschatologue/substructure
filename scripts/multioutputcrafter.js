const multCrafter = extendContent(GenericCrafter, "multi-output-crafter", {
  init(){
    this.outputItems = [
      new ItemStack(Items.silicon, 1),
      new ItemStack(Items.graphite, 2)
    ];
    this.super$init();
  },

  update(tile){
    entity = tile.ent();
    if(entity.cons.valid()){
      entity.progress += this.getProgressIncrease(entity, this.craftTime);
      entity.totalProgress += entity.delta();
      entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);

    } else {
      entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.02);
    }

    if(entity.progress >= 1){
      entity.cons.trigger();
      for(var i = 0; i < this.outputItems.length; i++){
        this.useContent(tile, this.outputItems[i].item);
        for(var j = 0; j < this.outputItems[i].amount; j++){
          this.offloadNear(tile, this.outputItems[i].item);
        }
      }
      Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
      entity.progress = 0;
    }

    if(entity.timer.get(this.timerDump, this.dumpTime) && this.outputItems[i] != null){
      for(var i = 0; i < this.outputItems.length; i++){
        this.tryDump(tile, this.outputItems[i].item);
      }
    }
  },

  shouldConsume(tile){
    for(var i = 0; i < this.outputItems.length; i++){
      if(this.outputItems[i] != null && tile.entity.items.get(this.outputItems[i].item) >= this.itemCapacity) return false;
       else return true;
    }
  }
});

multCrafter.size = 3;
multCrafter.hasItems = true;
multCrafter.hasLiquids = false;
multCrafter.hasPower = true;
multCrafter.consumes.power(2.6);
multCrafter.consumes.items(new ItemStack(Items.sand, 2), new ItemStack(Items.coal, 3));
multCrafter.requirements = ItemStack.with(Items.copper, 60, Items.lead, 30, Items.silicon, 40);
multCrafter.category = Category.crafting;
multCrafter.buildVisibility = BuildVisibility.shown;
