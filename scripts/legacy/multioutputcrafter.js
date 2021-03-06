const multCrafter = extendContent(GenericCrafter, "multi-output-crafter", {
  init(){
    this.outputItems = [
      new ItemStack(Items.silicon, 2),
      new ItemStack(Items.graphite, 2)
    ];
    this.super$init();
  },

  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.frameRegion = [];
    for(var i = 1; i < 4; i++){
      this.frameRegion.push(Core.atlas.find(this.name + "-frame-" + i));
    }
  },

  draw(tile){
    entity = tile.ent();

    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.rect(this.frameRegion[Mathf.floor(Mathf.absin(entity.totalProgress, 5, this.frameRegion.length))], tile.drawx(), tile.drawy());
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },

  generateIcons(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ]
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

    if(entity.timer.get(this.timerDump, this.dumpTime)){
      for(var i = 0; i < this.outputItems.length; i++){
        this.tryDump(tile, this.outputItems[i].item);
      }
    }
  },

  shouldConsume(tile){
    entity = tile.ent();

    for(var i = 0; i < this.outputItems.length; i++){
      if(this.outputItems[i] != null && tile.entity.items.get(this.outputItems[0].item) >= this.itemCapacity || tile.entity.items.get(this.outputItems[1].item) >= this.itemCapacity) return false;
       else return true;
    }
  }
});

multCrafter.size = 5;
multCrafter.hasItems = true;
multCrafter.hasLiquids = false;
multCrafter.hasPower = true;
multCrafter.craftEffect = Fx.smeltsmoke;
multCrafter.itemCapacity = 20;
multCrafter.consumes.power(2.9);
multCrafter.consumes.items(new ItemStack(Items.sand, 2), new ItemStack(Items.coal, 3));
multCrafter.requirements = ItemStack.with(Items.copper, 60, Items.lead, 30, Items.silicon, 40);
multCrafter.category = Category.crafting;
multCrafter.buildVisibility = BuildVisibility.shown;
