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
			var dialog = new BaseDialog("Unit Configuration");
			dialog.cont.table(cons(i => {
				i.add(Core.bundle.get("dialog.info.selected-unit") + this.getUnit().localizedName).growX().color(Pal.accent);
				i.row();
				i.image().growX().height(3).pad(4).color(Pal.accent);
				i.row();
				i.button(cons(b => {
					b.left();
					b.add(Core.bundle.get("dialog.info.switch-team"));
					b.row();
					b.image().growX().height(6).pad(4).color(this.getTeam().color);

					dialog.hide();
					dialog.show();
				}), () => {
					this.setTeam((this.getTeam().id + 1) > 5 ? 0 : this.getTeam().id + 1);
				}).growX();
				i.row();
				i.button(Core.bundle.get("dialog.short.back"), Icon.left, () => {
					dialog.hide();
				}).growX().align(Align.center).bottom();
			})).growY().width(260);

			dialog.cont.pane(cons(p => {
				var r = 0;
				var units = Vars.content.units();

				p.top().margin(6);
				p.add(Core.bundle.get("dialog.title.select-unit")).growX().center().color(Pal.accent);
				p.row();
				p.image().growX().height(3).pad(4).color(Pal.accent);
				p.row();
				
				units.each(cons(u => {
					p.button(cons(b => {
						b.left();
						b.image(u.icon(Cicon.medium)).size(40).padRight(2);
						b.add(u.localizedName);

						dialog.hide();
						dialog.show();
					}), () => {
						this.setUnit(u.id);
					}).marginTop(16).marginLeft(16).marginRight(16).fillX();

					if(++r % 3 == 0) p.row();
				}));
			})).height(720);

			dialog.show();
		},

		spawnUnit(unit, team, x, y){
			if(!Vars.net.client()){
				var spawnUnit = unit.create(team);

				spawnUnit.set(x, y);
				spawnUnit.add();
				this.configure("Created unit: " + unit.localizedName + " at " + (x / 8) + ", " + (y / 8));
			};
		},
		
		writeBase(write){
			this.super$writeBase(write);
			
			write.s(this._unit);
			write.s(this._team);
			write.i(this._unitX);
			write.i(this._unitY);
		},
		
		readBase(read){
			this.super$readBase(read);
			
			this._unit = read.s();
			this._team = read.s();
			this._unitX = read.i();
			this._unitY = read.i();
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
