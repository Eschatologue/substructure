const fx = require("fx");
const teleporter = extendContent(ItemBridge, "teleporter", {
  load(){
    this.super$load();
  },

  buildConfiguration(tile, table){
    entity = tile.ent();

    table.addImageButton(Icon.defense, Styles.clearTransi, run(() => {
      entity.setState("bullet");
    })).size(50).disabled(boolf(b => entity.power.status < 1));

    table.addImageButton(Icon.units, Styles.clearTransi, run(() => {
      entity.setState("unit");
    })).size(50).disabled(boolf(b => entity.power.status < 1));

    table.addImageButton(Icon.players, Styles.clearTransi, run(() => {
      entity.setState("player");
    })).size(50).disabled(boolf(b => entity.power.status < 1));
  },

  realRange(entity){
    return (this.teleRange + entity._phaseHeat * this.telePhaseRange) * entity._radscl;
  },

  drawLayer2(tile){
    entity = tile.ent();

    Draw.color(Color.valueOf("a387ea"));
    Lines.circle(e.x, e.y, this.realRange(entity));
  },

  update(tile){
    entity = tile.ent();
    linkedTile = Vars.world.tile(entity.link);
    rad = this.realRange(entity);

    this.super$update(tile);

    entity._phaseHeat = Mathf.lerpDelta(entity._phaseHeat, Mathf.num(entity.cons.valid()), 0.1);
    entity._radscl = Mathf.lerpDelta(entity._radscl, entity.cons.valid() ? 0 : 0.5, 0.05);

    if(linkedTile != null && entity.cons.valid()){
      if(entity.getState() == "bullet"){
        Vars.bulletGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(b => {
          if(b == null) return;
          if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, rad)){
            Effects.effect(fx.bulletCircleIn, b.x, b.y);
            b.set(linkedTile.drawx() - tile.drawx(), linkedTile.drawy() - tile.drawy());
            Effects.effect(fx.bulletCircleOut, linkedTile.drawx(), linkedTile.drawy());
          }
        }));
      }

      if(entity.getState() == "unit"){
        Vars.unitGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(unit => {
          if(unit.isDead()) return;
          if(Mathf.within(tile.drawx(), tile.drawy(), unit.x, unit.y, rad)){
            if(entity.timer.get(this.teleTimer, 180)){
              Effects.effect(fx.unitCircleIn, unit.x, unit.y);
              unit.moveBy(linkedTile.drawx() - tile.drawx(), linkedTile.drawy() - tile.drawy());
              Effects.effect(fx.unitCircleOut, unit.x, unit.y);
            }
          }
        }));
      }

      if(entity.getState() == "player"){
        Vars.playerGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(player => {
          if(player.isDead()) return;
          if(Mathf.within(tile.drawx(), tile.drawy(), player.x, player.y, rad)){
            if(entity.timer.get(this.teleTimer, 180)){
              Effects.effect(fx.unitCircleIn, player.x, player.y);
              player.moveBy(linkedTile.drawx() - tile.drawx(), linkedTile.drawy() - tile.drawy());
              Effects.effect(fx.unitCircleOut, player.x, player.y);
            }
          }
        }));
      }
    }
  }
});

teleporter.size = 1;
teleporter.solid = true;
teleporter.hasItems = true;
teleporter.range = 30;
teleporter.teleRange = 3;
teleporter.telePhaseRange = 6;
teleporter.teleTimer = teleporter.timers++;
teleporter.layer2 = Layer.power;
teleporter.requirements = ItemStack.with(Items.lead, 15, Items.graphite, 15, Items.surgealloy, 10);
teleporter.category = Category.effect;
teleporter.buildVisibility = BuildVisibility.shown;
teleporter.consumes.power(1.15);
teleporter.entityType = prov(() => {
  const entity = extend(ItemBridge.ItemBridgeEntity, {
    _phaseHeat: 0,
    _radscl: 0,

    getState(){
      return this._state;
    },

    setState(string){
      this._state = string;
    }
  });
  entity.setState("player");
  return entity;
});
