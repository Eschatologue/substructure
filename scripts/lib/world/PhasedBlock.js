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

const clone = (object) => {
    let c = {};
    for(let i in object){
        (typeof(object[i]) == "object" && object[i] != null) ? c[i] = clone(object[i]) : c[i] = object[i];
    };

    return c;
};

/**
 * Phased-block properties for the block type.
 *
 * @property {int}      consHealth              - Health of this block during construction.
 * @property {Color}    consColor               - The color of this block's hologram during construction.
 * @property {boolean}  variantPhaseRegions     - Whether or not use variant phase regions for each phase.
 * @property {Effect}   consEffect              - Effect made when this block is currently constructing.
 * @property {float}    consEffectChance        - Chance to trigger effect during constructing.
 * @property {Effect}   builtPhaseEffect        - Effect made when this block finished a construction phase.
 * @property {Effect}   builtEffect             - Effect made when this block finished all construction phases.
 *
 * @property {Sound}    consSound               - Sounds made when this block is currently constructing.
 * @property {float}    consSoundVolume         - Constructing sound volume.
 * @property {Sound}    builtPhaseSound         - Sounds made when this block finished a construction phase.
 * @property {float}    builtPhaseSoundVolume   - Finished one construction phase volume.
 * @property {Sound}    builtSound              - Sounds made when this block finished all construction phases.
 * @property {float}    builtSoundVolume        - Finished construction sound volume.
 *
 * @property {int}      consPhases              - How many construction phases this block has.
 * @property {Seq}      consRequirements        - Cost of constructing one phase of this block, each phase can have different requirements.
 * @property {float}    consCostMultiplier      - Multiplier for speed of constructing this block for each phase.
 */
const pbcObject = {
    consHealth: -1,
    consColor: Color.white,
    variantPhaseRegions: false,
    consEffect: Fx.none,
    consEffectChance: 0.06,
    builtPhaseEffect: Fx.none,
    builtEffect: Fx.none,

    consSound: this.ambientSound,
    consSoundVolume: this.ambientSoundVolume,
    builtPhaseSound: Sounds.none,
    builtPhaseSoundVolume: 0.05,
    builtSound: Sounds.none,
    builtSoundVolume: 0.05,

    consPhases: -1,
    consRequirements: new Seq(),
    consCostMultiplier: 1,
    phaseRegions: [],
    
    load(){
        this.super$load();
        
        if(this.variantPhaseRegions){
            for(let i = 0; i < this.consPhases; i++) this.phaseRegions[i] = Core.atlas.find(this.name + "-phase-" + i);
        };
    }
};

const pbbObject = {
    //do not override these!
    phase: 1,
    constructed: false,
    
    display(table){
        this.super$display(table);
        
        table.row();
        table.add(Core.bundle.format("lib.phaseblock.phase-display", this.phase)).growX().wrap().left();
    }
};

/**
 * Creates a phased-block.
 *
 * @param {Block}       classType     - The class type to extend, e.g. Block, GenericCrafter, etc.
 * @param {String}      name          - Name of the block, e.g. "some-block", "some-crafter", etc.
 * @param {Object}      classObject   - Object for the classType parameter.
 * @param {Building}    build         - The build type for classType, e.g. Building, GenericCrafterBuild, etc.
 * @param {Object}      buildObject   - Object for the build parameter.
 */
function PhasedBlock(classType, name, classObject, build, buildObject){
    classObject = Object.assign(pbcObject, classObject);
    buildObject = Object.assign(pbbObject, buildObject);

    //debugging
    //Log.info(Object.keys(classObject).toString());
    //Log.info(Object.keys(buildObject).toString());

    const pBlock = extend(classType, name, classObject);
    pBlock.buildType = () => extend(build, pBlock, clone(buildObject));

    return pBlock;
};
 
module.exports = PhasedBlock;