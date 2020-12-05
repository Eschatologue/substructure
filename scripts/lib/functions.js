module.exports = {
	setWIP(content){
		content.description = Core.bundle.get("excuse2") + Core.bundle.get(content.getContentType() + "." + content.name + ".description");
	}
};