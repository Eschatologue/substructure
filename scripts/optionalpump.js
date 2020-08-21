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
    this.stats.add(BlockStat.output. this.outputItem);
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

    if(entity.cons.valid()){
      entity.setProgress(entity.getProgress() += this.getProgIncrease(entity, this.craftTime));
      entity.setWarmup(Mathf.lerpDelta(entity.warmup, 1, 0.02));

      if(Mathf.chance(Time.delta() * this.updateEffectChance)){
        Effects.effect(this.updateEffect, entity.x + Mathf.range(this.size * 4), entity.y + Mathf.range(this.size * 4));
      }
    } else {
      entity.setWarmup(Mathf.lerp(entity.warmup, 0, 0.02));
    }

    if(entity.getProgress() >= 1){
      entity.cons.trigger();

      if(this.outputItem != null) useContent(tile, this.outputItem.item);

      Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
      entity.setProgress(0);
    }

    if(this.outputItem != null && tile.entity.timer.get(this.timerDump, this.dumpTime)){
        this.tryDump(tile, this.outputItem.item);
    }
  }
});

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
