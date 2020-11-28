const marked = extendContent(StatusEffect, "marked", {
    draw(unit){
        this.super$draw(unit);

        Draw.alpha(Mathf.absin());
        Draw.mixcol(Color.white, 8);
        unit.draw(unit);
    }
});

const block = extend(Block, "h", {
    size: 1,
    requirements(Category.distribution, BuildVisibility.shown, ItemStack.with(Items.copper, 230, Items.lead, 270, Items.silicon, 180)),

    load(){
        this.super$load();

        this.routerRegion = Core.atlas.find("router");
    }
});
block.buildType = () => extend(Building, {
    _routered: false,
    _timer: 0,

    placed(){
        this.startTimer();
    },

    updateTile(){
        this.super$updateTile();

        if(this._routered){
            this.detectEnemies();
            this.becomeRouter();
        };

        if(this.hitTime > 0){
            this.startTimer();
        };
    },

    detectEnemies(){
        Units.closestEnemy(this.team, this.x, this.y, 12 * Vars.tilesize, u => {
            if(u.dead() || u == null) return;

            this.markEnemy(u);
        });
    },

    startTimer(){
        this._timer = 0; 
        this._routered = false;
    },

    write(write){
        this.super$write(write);

        write.bool(this._routered);
        write.i(this._timer);
    },

    read(read){
        this.super$read(read);

        this._routered = read.bool();
        this._timer = read.i();
    }
});
