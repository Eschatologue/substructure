const fx = global.substructure.fx;

const boost = extend(StatusEffect, "boost", {
    color: Pal.accent,
    speedMultiplier: 1.20,
    healthMultiplier: 1.15,
    reloadMultiplier: 1.15,
    effect: fx.boosted,
    effectChance: 0.09,
    
    update(unit, time){
        if(Mathf.chanceDelta(this.effectChance)){
            Tmp.v1.rnd(unit.type.hitSize / 2);
            this.effect.at(unit.x + Tmp.v1.x, unit.y + Tmp.v1.y, 0, this.color);
        };
    }
});

module.exports = {
    boost: boost
};