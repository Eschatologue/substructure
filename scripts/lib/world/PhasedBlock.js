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

const clone = global.substructure.func.clone;
const enableDebug = true;

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
    classObject = Object.assign({
        consHealth: -1,
        consColor: Pal.accent,
        variantPhaseRegions: false,
        consEffect: Fx.none,
        consEffectChance: 0.06,
        builtPhaseEffect: Fx.none,
        builtEffect: Fx.none,

        consSound: this.ambientSound,
        consSoundVolume: this.ambientSoundVolume,
        builtPhaseSound: Sounds.place,
        builtPhaseSoundVolume: 0.04,
        builtSound: Sounds.unlock,
        builtSoundVolume: 0.4,

        consPhases: -1,
        consRequirements: null,
        consCostMultiplier: 1,
        phaseRegions: [],
        
        load(){
            this.super$load();
            
            if(this.variantPhaseRegions){
                for(let i = 0; i < this.consPhases; i++) this.phaseRegions[i] = Core.atlas.find(this.name + "-phase-" + i);
            };
            
            if(typeof(classObject["cload"]) === "function") this.cload();
        },
        
        getIcon(){
            return this.icon(Cicon.full);
        }
    }, classObject);
    buildObject = Object.assign({
        //do not override these!
        phase: 1,
        isConstructed: false,
        
        display(table){
            this.super$display(table);
            
            if(!this.isConstructed){
                table.row();
                table.add(Core.bundle.format("lib.phaseblock.phase-display", this.phase)).growX().wrap().left();
            }
        },
        
        updateTile(){
            if(this.isConstructed){
                this.super$updateTile();
                if(typeof(buildObject["cupdate"]) === "function") this.cupdate();
            }else{
                this.consUpdate();
            };
        },
        
        consUpdate(){
            
        },
        
        phaseFinish(p){
            const block = pBlock;
            
            if(p < this.phase || this.isConstructed){
                this.isConstructed ?
                    Log.error("This building is already constructed!") :
                    Log.error("This building is already at phase " + this.phase + "!");
            }else if(p >= block.consPhases){
                block.builtSound.at(this.x, this.y, 1, block.builtSoundVolume);
                block.builtEffect.at(this.x, this.y, 0, pBlock.consColor, this);
                
                this.isConstructed = true;
            }else{
                block.builtPhaseSound.at(this.x, this.y, 1, block.builtPhaseSoundVolume);
                block.builtPhaseEffect.at(this.x, this.y, 0, pBlock.consColor, this);
                
                this.phase++;
            };
        },
        
        write(write){
            this.super$write(write);
            
            write.bool(this.isConstructed);
            write.i(this.phase);
        },
        
        read(read, revision){
            this.super$read(read, revision);
            
            this.isConstructed = read.bool();
            this.phase = read.i();
        },
        
        currentPhase(){
            return this.phase;
        },
        
        constructed(){
            return this.isConstructed;
        },
        
        pblock(){
            return pBlock;
        }
    }, buildObject);

    if(enableDebug){
        Log.info(classType + " | " + name + ": " + Object.keys(classObject).toString());
        Log.info(build + " | " + name + ": " + Object.keys(buildObject).toString());
    };
    
    const pBlock = extend(classType, name, classObject);
    pBlock.update = true;
    pBlock.sync = true;
    build == Building ? pBlock.buildType = () => extend(build, clone(buildObject)) : pBlock.buildType = () => extend(build, pBlock, clone(buildObject));
};
 
module.exports = PhasedBlock;