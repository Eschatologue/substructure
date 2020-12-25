/*
    Copyright (C) 2020 Gdeft

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const PhasedBlock = global.substructure.PhasedBlock;
const fx = global.substructure.fx;

const tradingPost = new PhasedBlock(Block, "trading-post", {
    requirements: ItemStack.with(Items.copper, 370, Items.lead, 350, Items.graphite, 240, Items.silicon, 280),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    size: 3,
    
    builtPhaseEffect: fx.phaseFinished,
    builtEffect: fx.consFinished,
    consRequirements: Seq.with(new ItemStack(Items.copper, 40), new ItemStack(Items.graphite, 30), new ItemStack(Items.copper, 80), new ItemStack(Items.lead, 25), new ItemStack(Items.silicon, 20)),
    consPhases: 5,
}, Building, {
    
});

let b = Vars.world.build(52, 18);
let c = Vars.world.build(51, 19);