importPackage(Packages.arc.graphics.gl);
const teleBuffer = new FrameBuffer(2, 2);
const fx = require("fx");
const teleporter = extendContent(ItemBridge, "teleporter", {
  realRange(entity){
    return ((this.teleRange + entity.getCryoHeat() * this.teleCryoRange) * entity.getScl()) * Vars.tilesize;
  },

  drawSelect(tile){
    Draw.color(Color.valueOf("9c88c3"));
    Lines.dashCircle(tile.drawx(), tile.drawy(), this.realRange(tile.ent()));
  },

  drawLayer(tile){
    entity = tile.ent();
    rad = this.realRange(entity);

    this.super$drawLayer(tile);

    if(!Core.graphics.isHidden() && (teleBuffer.getWidth() != Core.graphics.getWidth() || teleBuffer.getHeight() != Core.graphics.getHeight())){
        teleBuffer.resize(Core.graphics.getWidth(), Core.graphics.getHeight());
    }

    Draw.flush();
    teleBuffer.begin();
    Core.graphics.clear(Color.clear);
    Draw.color(Color.valueOf("a387ea"));
    Fill.circle(tile.drawx(), tile.drawy(), this.realRange(entity));
    Draw.color();
    Draw.flush();
    teleBuffer.end();
    Draw.shader(Shaders.shield);
    Draw.color(Color.valueOf("a387ea"));
    Draw.rect(Draw.wrap(teleBuffer.getTexture()), Core.camera.position.x, Core.camera.position.y, Core.camera.width, -Core.camera.height);
    Draw.color();
    Draw.shader();
  },

  update(tile){
    entity = tile.ent();
    linkedTile = Vars.world.tile(entity.link);
    rad = this.realRange(entity);
    cryoValid = this.consumes.get(ConsumeType.liquid).valid(entity);

    this.super$update(tile);

    entity.setCryoHeat(Mathf.lerpDelta(entity.getCryoHeat(), Mathf.num(cryoValid), 0.1));
    entity.setScl(Mathf.lerpDelta(entity.getScl(), entity.cons.valid() ? entity.getWarmup() : 0, 0.05));
    entity.setWarmup(Mathf.lerpDelta(entity.getWarmup(), entity.efficiency(), 0.1));

    if(cryoValid && entity.power.status > 0 && entity.timer.get(this.cryoTimer, this.cryoConsumeTimer) && entity.efficiency() > 0) entity.cons.trigger();
    if(linkedTile == null) return;

    try {
      if(linkedTile.block() == teleporter && entity.cons.valid()){
        //if(entity.getState() == "bullet"){
          Vars.bulletGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(b => {
            if(b == null || b.getTeam() != tile.getTeam()) return;
            if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, rad)){
              Effects.effect(fx.bulletCircleIn, b.x, b.y);
              b.set(linkedTile.drawx(), linkedTile.drawy());
              Effects.effect(fx.bulletCircleOut, linkedTile.drawx(), linkedTile.drawy());
            }
          }));
        //}

        //if(entity.getState() == "unit"){
          Vars.unitGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(unit => {
            if(unit.isDead() || unit.getTeam() != tile.getTeam()) return;
            if(Mathf.within(tile.drawx(), tile.drawy(), unit.x, unit.y, rad) && unit.getTeam() == tile.getTeam()){
              if(entity.timer.get(this.teleTimer, 180)){
                Effects.effect(fx.unitCircleIn, unit.x, unit.y);
                unit.moveBy(linkedTile.drawx() - tile.drawx(), linkedTile.drawy() - tile.drawy());
                Effects.effect(fx.unitCircleOut, unit.x, unit.y);
              }
            }
          }));
        //}

        //if(entity.getState() == "player"){
          Vars.playerGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(player => {
            if(player.isDead() || player.getTeam() != tile.getTeam()) return;
            if(Mathf.within(tile.drawx(), tile.drawy(), player.x, player.y, rad)  && player.getTeam() == tile.getTeam()){
              if(entity.timer.get(this.teleTimer, 180)){
                Effects.effect(fx.unitCircleIn, player.x, player.y);
                player.moveBy(linkedTile.drawx() - tile.drawx(), linkedTile.drawy() - tile.drawy());
                Effects.effect(fx.unitCircleOut, player.x, player.y);
              }
            }
          }));
        //}
      }
    } catch(err){
      print(err);
    }
  }
});

teleporter.size = 1;
teleporter.solid = true;
teleporter.hasItems = true;
teleporter.hasLiquids = true;
teleporter.range = 30;
teleporter.teleRange = 2;
teleporter.teleCryoRange = 2;
teleporter.cryoTimer = teleporter.timers++;
teleporter.cryoConsumeTimer = 360;
teleporter.teleTimer = teleporter.timers++;
teleporter.requirements = ItemStack.with(Items.lead, 15, Items.graphite, 15, Items.surgealloy, 10);
teleporter.category = Category.effect;
teleporter.buildVisibility = BuildVisibility.shown;
teleporter.consumes.liquid(Liquids.cryofluid, 0.1).boost();
teleporter.consumes.power(1.15);
teleporter.entityType = prov(() => {
  const entity = extend(ItemBridge.ItemBridgeEntity, {
    getCryoHeat(){
      return this._cryoHeat;
    },

    setCryoHeat(float){
      this._cryoHeat = float;
    },

    getScl(){
      return this._scl;
    },

    setScl(float){
      this._scl = float;
    },

    getWarmup(){
      return this._warmup;
    },

    setWarmup(float){
      this._warmup = float;
    }
  });
  entity.setWarmup(0);
  entity.setScl(0);
  entity.setCryoHeat(0);
  return entity;
});
