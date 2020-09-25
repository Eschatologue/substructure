module.exports = {
	stringDialog(string){
		var dialog = new BaseDialog("");
		var cont = dialog.cont;

		cont.table(cons(t => {
			t.add(string);
		}));

		dialog.addCloseButton();
		dialog.show();
	}
};
