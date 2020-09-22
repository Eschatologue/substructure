const bPReader = extendContent(MessageBlock, "block-position-reader", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find(this.name + "-top");
	},

	icons(){
		return [
			Core.atlas.find(this.region),
			Core.atlas.find(this.topRegion)
		];
	}
});
bPReader.size = 1;
bPReader.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
bPReader.buildVisibility = BuildVisibility.shown;
bPReader.category = Category.logic;
bPReader.configurable = true;
bPReader.rotate = true;
bPReader.buildType = () => {
	const ent = extendContent(MessageBlock.MessageBuild, bPReader, {
		draw(){
			Draw.rect(bPReader.region, this.x, this.y);
			Draw.rect(bPReader.topRegion, this.x, this.y, this.rotdeg());
		},

		buildConfiguration(table){
			var otherPos = this.tile.getNearby(this.rotation);
			var otherPosEnt = this.tile.getNearbyEntity(this.rotation);

			table.button(Icon.commandRally, () => {
				this.configure("X: " + (this.x / 8) + " Y: " + (this.y / 8));
			}).size(40);
			table.button(Icon.up, () => {
				otherPosEnt == null ? this.configure("X: " + (otherPos.getX() / 8) + " Y: " + (otherPos.getY() / 8)) : this.configure("X: " + (otherPosEnt.getX() / 8) + " Y: " + (otherPosEnt.getY() / 8));
			}).size(40);
		},

		placed(){
			this.super$placed();

			this.configure("...");
		}
	});
	return ent;
};
