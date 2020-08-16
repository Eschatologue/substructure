const fx = require("fx");
const teleporter = extendContent(ItemBridge, "teleporter", {
  load(){
    this.super$load();
  },

  buildConfiguration(tile, table){
    entity = tile.ent();

    var rangeSlider = table.addSlider(1, this.maxRange, 1, null).width(160).get();
    rangeSlider.changed(run(() => {
      entity.setRange(rangeSlider.getValue());
    }));
  },

  update(tile){
    entity = tile.ent();
    linkedTile = Vars.world.tile(entity.link);
    rad = Vars.tilesize * entity.getRange();

    this.super$update(tile);
    if(linkedTile != null && linkedTile.block().name == this.name){
      Vars.bulletGroup.intersect(tile.drawx() - rad, tile.drawy() - rad, rad * 2, rad * 2, cons(b => {
        if(b == null) return;
        if(Mathf.within(tile.drawx(), tile.drawy(), b.x, b.y, rad)){
          Effects.effect(fx.bulletCircleIn, b.x, b.y);
          b.set(linkedTile.getX(), linkedTile.getY());
          Effects.effect(fx.bulletCircleOut, linkedTile.drawx(), linkedTile.drawy());
        }
      }));
    }
  }
});

teleporter.size = 1;
teleporter.solid = true;
teleporter.hasItems = true;
teleporter.range = 36;
teleporter.maxRange = 6;
teleporter.requirements = ItemStack.with(Items.lead, 15, Items.graphite, 15, Items.surgealloy, 10);
teleporter.category = Category.effect;
teleporter.buildVisibility = BuildVisibility.shown;
teleporter.entityType = prov(() => {
  const entity = extend(ItemBridge.ItemBridgeEntity, {
    getRange(){
      return this._range;
    },

    setRange(int){
      this._range = int;
    },

    write(stream){
      this.super$write(stream);
      stream.writeShort(this._range);
    },

    read(stream, revision){
      this.super$read(stream, revision);
      this._range = read.readShort();
    }
  });
  entity.setRange(1);
  return entity;
});
