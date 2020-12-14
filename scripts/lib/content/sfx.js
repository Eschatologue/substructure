const overcock = extend(StatusEffect, "overcock", {
    color: Pal.accent,
    speedMultiplier: 1.15,
    healthMultiplier: 1.15,
    reloadMultiplier: 1.15,
    effect: Fx.overclocked,
    effectChance: 0.07,
});
overcock.init(() => {
    overcock.opposite(StatusEffects.slow, StatusEffects.muddy, StatusEffects.sporeSlowed);   
    overcock.trans(StatusEffects.overclock, ((unit, time, newTime, result) => {
        unit.heal(unit.health / 8);
        Fx.launch.at(unit.x, unit.y);
  
        result.set(Fx.overclock, newTime);
    }));
});

module.exports = {
    overcock: overcock
};