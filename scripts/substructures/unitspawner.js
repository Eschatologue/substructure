const functions = this.global.substructure.functions;

const unitSpawner = extendContent(MessageBlock, "unit-spawner", {});
unitSpawner.size = 1;
unitSpawner.solid = false;
unitSpawner.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
unitSpawner.buildVisibility = BuildVisibility.sandboxOnly;
unitSpawner.category = Category.logic;
unitSpawner.configurable = true;
unitSpawner.buildType = () => {
	const ent = extendContent(MessageBlock.MessageBuild, unitSpawner, {
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
			
			this.setUnitX(this.getX());
			this.setUnitY(this.getY());
			print("X: " + this.getUnitX() + " Y: " + this.getUnitY());
		},
		
		draw(){
			this.super$draw();

			Draw.alpha(0.65);
			Draw.mixcol(this.getTeam().color, 1);
			Draw.rect(this.getUnit().icon(Cicon.full), this.getUnitX(), this.getUnitY());
			Draw.reset();
		},

		buildConfiguration(table){
			table.button(Icon.fileText, () => {
				this.unitDialog();
			}).size(40);
			table.button(Icon.add, () => {
				this.spawnUnit(this.getUnit(), this.getTeam(), this.getUnitX(), this.getUnitY());
			}).size(40);
		},

		unitDialog(){
			var dialog = new BaseDialog("$dialog.name.unit-config");
			var cont = dialog.cont;
			
			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.title.select-unit").growX().center().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(800).center().row();
			
			cont.pane(cons(p => {
				var ru = 0;
				var units = Vars.content.units();
				
				units.each(cons(u => {
					p.button(cons(b => {
						b.left();
						b.image(u.icon(Cicon.medium)).size(40).padRight(2);
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
			var dialog = new BaseDialog("$dialog.title.select-team");
			var cont = dialog.cont;

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.info.base-teams").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();
			
			cont.pane(cons(p => {
				var rt = 0;
				var teams = Team.baseTeams;
				
				for(var i in teams){
					var team = teams[i];
					
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
				var rt = 0;
				var teams = Team.all;
				
				for(var i in teams){
					var team = teams[i];
					
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
						}
					}));
				}).growX().height(54).pad(4);
			})).width(300);
			
			dialog.addCloseButton();
			dialog.show();
		},
		
		posDialog(){
			var dialog = new BaseDialog("$dialog.title.select-position");
			var cont = dialog.cont;
			
			cont.table(cons( t => {
				t.button("$dialog.info.reset-position", () => {
					this.setUnitX(this.getX());
					this.setUnitY(this.getY());
				}).growX().height(54).pad(4);
			})).width(300).center().row();
			
			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.info.custom-position").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();
			
			cont.table(cons(t => {
				var worldX = Vars.world.width();
				var worldY = Vars.world.height();
				
				t.button("$dialog.short.set-x", () => {
					Vars.ui.showTextInput("", "X:", 4, (this.getUnitX() / Vars.tilesize), true, cons(x => {
						if(x <= worldX){
							this.setUnitX(x * Vars.tilesize);
						}else{
							Vars.ui.showInfo("$dialog.error.invalid-pos");
						};
					}));
				}).growX().height(54).pad(4).row();
				
				t.button("$dialog.short.set-y", () => {
					Vars.ui.showTextInput("", "Y:", 4, (this.getUnitY() / Vars.tilesize), true, cons(y => {
						if(y <= worldY){
							this.setUnitY(y * Vars.tilesize);
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
			var teamColor = "[#" + team.color + "]";

			unit.spawn(team, x, y);
			this.configure("Created unit " + teamColor + unit.localizedName + "[] at " + (x / Vars.tilesize) + ", " + (y / Vars.tilesize));
		},
		
		writeBase(write){
			this.super$writeBase(write);
			
			write.s(this._unit);
			write.s(this._team);
			
			write.s(this._unitX);
			write.s(this._unitY);
		},
		
		readBase(read){
			this.super$readBase(read);
			
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
		},
		
		setUnitX(pos){
			this._unitX = pos;
		},
		
		getUnitX(){
			return this._unitX;
		},
		
		setUnitY(pos){
			this._unitY = pos;
		},
		
		getUnitY(){
			return this._unitY;
		}
	});
	return ent;
};
