//TODO complete
const oPump = extendContent(SolidPump, "optional-pump", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },

  generateIcons(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ]
  },

  setStats(){
    this.super$setStats();
    this.stats.add(BlockStat.productionTime, this.craftTime / 60, StatUnit.seconds);
    this.stats.add(BlockStat.output, this.outputItem);
  },

  draw(tile){
    entity = tile.ent();

    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },

  getProgIncrease(entity, baseTime){
    return 1 / baseTime * entity.delta() * entity.efficiency();
  },

  update(tile){
    entity = tile.ent();
    itemValid = this.consumes.get(ConsumeType.item).valid(entity);
    liquidValid = this.consumes.get(ConsumeType.liquid).valid(entity);

    if(itemValid && liquidValid){
      entity.setProgress(entity.getProgress() + this.getProgIncrease(entity, this.craftTime));
      entity.setWarmup(Mathf.lerpDelta(entity.warmup, 1, 0.02));
    } else {
      entity.setWarmup(Mathf.lerp(entity.warmup, 0, 0.02));
    }

    if(entity.getProgress() >= 1){
      entity.cons.trigger();

      if(this.outputItem != null){
        this.useContent(tile, this.outputItem.item);
        for(i = 0; i < this.outputItem.amount; i++){
            this.offloadNear(tile, this.outputItem.item);
        }
      }

      Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
      entity.setProgress(0);
    }

    if(this.outputItem != null && tile.entity.timer.get(this.timerDump, this.dumpTime)){
        this.tryDump(tile, this.outputItem.item);
    }

    this.super$update(tile);
  }
});

oPump.size = 3;
oPump.updateEffect = Fx.none;
oPump.updateEffectChance = 0;
oPump.category = Category.production;
oPump.buildVisibility = BuildVisibility.shown;
oPump.requirements = ItemStack.with(Items.copper, 170, Items.lead, 115, Items.graphite, 150, Items.titanium, 90, Items.silicon, 65);
oPump.attribute = Attribute.oil;
oPump.result = Liquids.oil;
oPump.pumpAmount = 0.18;
oPump.outputItem = new ItemStack(Items.plastanium, 1);
oPump.craftEffect = Fx.smeltsmoke;
oPump.craftTime = 60;
oPump.consumes.item(Items.titanium, 2).optional(true, false);
oPump.consumes.liquid(Liquids.oil, 0.15).optional(true, false);
oPump.consumes.power(3.45);
oPump.entityType = prov(() => {
  const entity = extend(SolidPump.SolidPumpEntity, {
    getWarmup(){
      return this._warmup;
    },

    setWarmup(float){
      this._warmup = float;
    },

    getProgress(){
      return this._progress;
    },

    setProgress(float){
      return this._progress = float;
    },

    write(stream){
      this.super$write(stream);
      stream.writeFloat(this._warmup);
      stream.writeFloat(this._progress);
    },

    read(stream, revision){
      this.super$read(stream, revision);
      this._progress = stream.readFloat();
      this._warmup = stream.readFloat();
    }
  });
  return entity;
});
