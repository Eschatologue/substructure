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
const extendf = global.substructure.func.extendf;

const unitSpawner = extendf(Block, "unit-spawner", {
    requirements: ItemStack.with(Items.copper, 2, Items.lead, 4),
    buildVisibility: BuildVisibility.sandboxOnly,
    category: Category.logic,
    
    health: 40,
    size: 1,
    configurable: true,
    solid: false,

    load(){
        this.super$load();
        
        this.baseRegion = Core.atlas.find("substructure-base");
    },
    
    icons(){
        return [this.baseRegion, this.region];
    }
}, Building, {
    init(tile, team, shouldAdd, rotation){
        if(!this.initialized){
            this.create(tile.block(), team);
        }else{
            //Useless, but I don't want to remove it.
            if(this.block.hasPower){
                this.power.graph = new PowerGraph();
                this.power.graph.add();
            };
        };
        this.rotation = rotation;
        this.tile = tile;
        
        this.setUnit(UnitTypes.dagger.id);
        this.setTeam(team.id);
        
        this.set(tile.drawx(), tile.drawy());
        if(shouldAdd) this.add();
        
        this.created();
        return this;
        //print("Default Unit: " + this.getUnit() + "; Team: " + this.getTeam());
    },

    placed(){
        this.super$placed();

        this._unitX = this.getX();
        this._unitY = this.getY();
        //print("X: " + this.getUnitX() + " Y: " + this.getUnitY());
    },

    draw(){
        Draw.rect(this.blockf().baseRegion, this.x, this.y);
        
        Draw.alpha(0.75);
        Draw.mixcol(this.getTeam().color.cpy().mul(1 + Mathf.absin(Time.time / 2, 1, 0.035)), 1);
        Draw.rect(this.getUnit().icon(Cicon.full), this._unitX, this._unitY);
        Draw.rect(this.block.region, this.x, this.y);
        
        Draw.reset();
    },

    buildConfiguration(table){
        table.button(Icon.fileText, () => {
            this.unitDialog();
        }).size(40);
        table.button(Icon.add, () => {
            this.spawnUnit(this.getUnit(), this.getTeam(), this._unitX, this._unitY);
        }).size(40);
    },

    unitDialog(){
        let dialog = new BaseDialog("$dialog.name.unit-config");
        let cont = dialog.cont;
			
        cont.table(cons(t => {
            t.top().margin(6);
            t.add("$dialog.title.select-unit").growX().center().color(Pal.accent);
            t.row();
            t.image().fillX().height(3).pad(4).color(Pal.accent);
        })).width(800).center().row();

        cont.pane(cons(p => {
            let ru = 0;
            let units = Vars.content.units();
				
            units.each(cons(u => {
                p.button(cons(b => {
                    b.left();
                    b.image(u.icon(Cicon.medium)).scaling(Scaling.fit).size(40).padRight(6);
                    b.add(u.localizedName);
                }), () => {
                    this.setUnit(u.id);
                }).margin(12).fillX();

                if(++ru % 3 == 0) p.row();
            }));
        })).width(800).height(540).top().center().row();

        cont.table(cons(i => {
            i.table(cons(t => {
                t.button("$dialog.title.select-team", Icon.modeSurvival, () => {
                    this.teamDialog();
                }).width(220).pad(4).growY();

                t.button("$dialog.title.select-position", Icon.grid, () => {
                    this.posDialog();
                }).width(220).pad(4).growY();
            }));
        })).width(360).bottom().center();

        dialog.addCloseButton();
        dialog.show();
    },
		
    teamDialog(){
        let dialog = new BaseDialog("$dialog.title.select-team");
        let cont = dialog.cont;

        cont.table(cons(t => {
            t.top().margin(6);
            t.add("$dialog.info.base-teams").growX().color(Pal.accent);
            t.row();
            t.image().fillX().height(3).pad(4).color(Pal.accent);
        })).width(320).center().row();

        cont.pane(cons(p => {
            let rt = 0;
            let teams = Team.baseTeams;
				
            for(let i in teams){
                let team = teams[i];

                this.addTeamButton(p, team);
                if(++rt % 3 == 0) p.row();
            };
        })).width(320).center().row();

        cont.table(cons(t => {
            t.top().margin(6);
            t.add("$dialog.info.all-teams").growX().color(Pal.accent);
            t.row();
            t.image().fillX().height(3).pad(4).color(Pal.accent);
        })).width(320).center().row();

        cont.pane(cons(p => {
            let rt = 0;
            let teams = Team.all;

            for(let i in teams){
                let team = teams[i];
                
                this.addTeamButton(p, team);
                if(++rt % 3 == 0) p.row();
            };
        })).width(320).height(220).center().row();

        cont.table(cons(t => {
            t.top().margin(6);
            t.add("$dialog.short.others").growX().color(Pal.accent);
            t.row();
            t.image().fillX().height(3).pad(4).color(Pal.accent);
        })).width(320).center().row();

        cont.table(cons(t => {
            t.button("$dialog.info.reset-team", () => {
                this.setTeam(this.team.id);
            }).growX().height(54).pad(4).row();
				
            t.button("$dialog.info.set-team-id", () => {
                Vars.ui.showTextInput("", "$dialog.short.set-id", 8, this.getTeam().id, true, cons(t => {
                    if(Team.get(t) != null){
                        this.setTeam(t);
                    }else{
                        Vars.ui.showErrorMessage("$dialog.short.invalid-id");
                    };
                }));
            }).growX().height(54).pad(4);
        })).width(300);

        dialog.addCloseButton();
        dialog.show();
    },
		
    posDialog(){
        let dialog = new BaseDialog("$dialog.title.select-position");
        let cont = dialog.cont;

        cont.table(cons( t => {
            t.button("$dialog.info.reset-position", () => {
                this._unitX = this.getX();
                this._unitY = this.getY();
            }).growX().height(54).pad(4);
        })).width(300).center().row();

        cont.table(cons(t => {
            t.top().margin(6);
            t.add("$dialog.info.custom-position").growX().color(Pal.accent);
            t.row();
            t.image().fillX().height(3).pad(4).color(Pal.accent);
        })).width(320).center().row();

        cont.table(cons(t => {
            let worldX = Vars.world.width();
            let worldY = Vars.world.height();
				
            t.button("$dialog.short.set-x", () => {
                Vars.ui.showTextInput("", "X:", 4, (this._unitX / Vars.tilesize), true, cons(x => {
                    if(x <= worldX){
                        this._unitX = x * Vars.tilesize;
                    }else{
                        Vars.ui.showInfo("$dialog.error.invalid-pos");
                    };
                }));
            }).growX().height(54).pad(4).row();
				
            t.button("$dialog.short.set-y", () => {
                Vars.ui.showTextInput("", "Y:", 4, (this._unitY / Vars.tilesize), true, cons(y => {
                    if(y <= worldY){
                        this._unitY = y * Vars.tilesize;
                    }else{
                        Vars.ui.showInfo("$dialog.error.invalid-pos");
                    };
                }));
            }).growX().height(54).pad(4);
        })).width(300).center();

        dialog.addCloseButton();
        dialog.show();
    },

    addTeamButton(p, team){
        p.button(cons(b => {
            b.left();
            b.image().size(40).pad(2).color(team.color);
        }), () => {
            this.setTeam(team.id);
        }).pad(2);
    },

    spawnUnit(unit, team, x, y){ //There is no ${}
        let teamColor = "[#" + team.color + "]";

        unit.spawn(team, x, y);
        this.configure("Created unit " + teamColor + unit.localizedName + "[] at " + (x / Vars.tilesize) + ", " + (y / Vars.tilesize));
    },

    write(write){
        this.super$write(write);
	
        write.s(this._unit);
        write.s(this._team);

        write.s(this._unitX);
        write.s(this._unitY);
    },

    read(read, revision){ 
        this.super$read(read, revision);

        this._unit = read.s();
        this._team = read.s();

        this._unitX = read.s();
        this._unitY = read.s();
    },

    setUnit(id){
        this._unit = id;
    },

    getUnit(){
        return Vars.content.getByID(ContentType.unit, this._unit);
    },

    setTeam(id){
        this._team = id;
    },

    getTeam(){
        return Team.get(this._team);
	}
});