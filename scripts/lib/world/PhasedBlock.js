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
const enableDebug = false;

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
        
        init(tile, team, shouldAdd, rotation){
            this.consBars();
            
            this.maxHealthc = this.pblock().consHealth;
            this.healthc = this.pblock().consHealth;
            
            return this.super$init(tile, team, shouldAdd, rotation);
        },
        
        display(table){            
            if(!this.isConstructed){
                table.table(cons(t => {
                    t.left();
                    t.add(new Image(this.block.getDisplayIcon(this.tile))).size(8 * 4);
                    t.labelWrap(this.block.getDisplayName(this.tile)).left().width(190).padLeft(5);
                })).growX().left();
                table.row();
                
                table.table(cons(bars => {
                    bars.defaults().growX().height(18).pad(4);
                    this.displayCbars(bars);
                })).growX();
                table.row();
                
                let phase = this.phase;
                let itemf = this.phaseReq(this.phase);
                let amount = this.items != null ? this.items.get(itemf.item) : 0;
                
                table.table(cons(t => {
                    const rebuild = new RunnableAction();
                    rebuild.setRunnable(() => {
                        t.clearChildren();
                        t.left();
                        
                        t.add(Core.bundle.format("lib.phaseblock.phase-display", phase)).left();
                        t.row();
                        
                        t.table(cons(t2 => {
                            t2.left();
                                
                            t2.add(new Image(itemf.item.icon(Cicon.small)));
                            t2.labelWrap(amount + " / " + itemf.amount).left().width(190).padLeft(5);
                        })).left();
                    });
                    
                    rebuild.run();
                    t.update(() => {
                        if(!this.isConstructed){
                            amount = this.items != null ? this.items.get(itemf.item) : 0;
                            itemf = this.phaseReq(this.phase);
                            phase = this.phase;
                            
                            rebuild.run();
                        }else{
                            t.clearChildren();
                            t.add("$lib.phaseblock.block-constructed").center();
                        };
                    });
                })).padTop(12).growX().left();
                
                table.marginBottom(-5);
            }else{
                this.super$display(table);
            };
        },
        
        displayCbars(table){
            this.cbars.each(bar => {
                table.add(bar).growX();
                table.row();
            });
        },
        
        consBars(){
            this.cbars = new Seq();
            
            this.cbars.add(new Bar(Core.bundle.get("stat.health"), Pal.lancerLaser, floatp(() => this.healthcf())));
            this.cbars.add(new Bar(Core.bundle.get("lib.phaseblock.progress"), Pal.accent, floatp(() => this.phasef())));
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
            const itemf = this.phaseReq(this.phase);
            if(this.items != null && this.items.has(itemf.item, itemf.amount)){
                this.phaseFinish(this.phase);
                this.items.remove(itemf.item, itemf.amount);
            };
        },
        
        shouldConsume(){
            const itemf = this.phaseReq(this.phase);
            if(!this.isConstructed){
                if(this.items.get(itemf.item) >= itemf.amount) return false;
                
                return true;
            }else{
                this.super$shouldConsume();
            };
        },
        
        acceptItem(source, item){
            if(!this.isConstructed){
                return this.phaseReq(this.phase).item == item && this.items.get(item) < this.getMaximumAccepted(item);
            }else{
                this.super$acceptItem(source, item);
            };
        },
        
        getMaximumAccepted(item){
            if(!this.isConstructed){
                return this.phaseReq(this.phase).amount;
            }else{
                this.super$getMaximumAccepted(item);
            };
        },
        
        phaseFinish(p){
            const block = pBlock;
            
            if(p < this.phase || this.isConstructed){
                this.isConstructed ?
                    Log.error("This building is already constructed!") :
                    Log.error("This building is already at phase " + this.phase + "!");
            }else if(p >= block.consPhases){
                this.consEffect(this.x, this.y, 1, block.builtSoundVolume, 0, block.consColor);
                
                this.isConstructed = true;
            }else{
                this.phaseEffect(this.x, this.y, 1, block.builtPhaseSoundVolume, 0, block.consColor);
                
                this.phase++;
            };
        },

        consEffect(x, y, pitch, volume, rotation, color){
            pBlock.builtSound.at(x, y, pitch, volume);
            pBlock.builtEffect.at(x, y, rotation, color, this);
        },

        phaseEffect(x, y, pitch, volume, rotation, color){
            pBlock.builtPhaseSound.at(x, y, pitch, volume);
            pBlock.builtPhaseEffect.at(x, y, rotation, color, this);
        },

        write(write){
            this.super$write(write);
            
            write.bool(this.isConstructed);
            write.i(this.phase);
            write.f(this.healthc);
        },

        read(read, revision){
            this.super$read(read, revision);
            
            this.isConstructed = read.bool();
            this.phase = read.i();
            this.healthc = read.f();
        },

        cPhase(){
            return this.phase;
        },

        constructed(){
            return this.isConstructed;
        },
        
        healthcf(){
            return this.healthc / this.maxHealthc;
        },
        
        phaseReq(phase){
            return pBlock.consRequirements.get(phase - 1);
        },

        phaseReqf(){
            let itemf = this.phaseReq(this.phase);
            return this.items != null ? this.items.get(itemf.item) / itemf.amount : 0;
        },
        
        phasef(){
            return this.phase / pBlock.consPhases;
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
    pBlock.hasItems = true;
    pBlock.acceptsItems = true;
    pBlock.update = true;
    pBlock.sync = true;
    build == Building ? pBlock.buildType = () => extend(build, clone(buildObject)) : pBlock.buildType = () => extend(build, pBlock, clone(buildObject));
};
 
module.exports = PhasedBlock;