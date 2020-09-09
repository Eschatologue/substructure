const bPReader = extendContent(MessageBlock, "block-position-reader", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find(this.name + "-top");
	}
});
bPReader.size = 1;
bPReader.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
bPReader.buildVisibility = BuildVisibility.shown;
bPReader.category = Category.effect;
bPReader.rotate = true;
bPReader.entityType = () => {
	const ent = extendContent(MessageBlock.MessageBuild, bPReader, {
		draw(){
			Draw.rect(this.block.region, this.x, this.y);
			Draw.rect(this.block.topRegion, this.x, this.y, this.rotation);
		},
		
		buildConfiguration(table){
			var otherPos = this.tile.getNearby(this.rotation % 90);
			
			table.button(Icon.commandRallySmall, () => {
				this.configure("X: " + (this.x / 8) + " Y: " + (this.y / 8));
			}).size(40);
			table.button(Icon.up, () => {
				this.configure("X: " + (otherPos.getX() / 8) + " Y: " + (otherPos.getY() / 8));
			}).size(40);
		}
	});
	return ent;
};
