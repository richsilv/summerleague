Template.mainLayout.helpers({
	route: function(name) {
		return name === Router.current().route.name;
	}
});