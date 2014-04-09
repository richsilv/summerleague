Template.mainLayout.helpers({
	route: function(name) {
		return (Router.current() && Router.current().route) ? name === Router.current().route.name.slice(0, name.length) : false;
	}
});

Template.mainLayout.events({
	'click #top-bar li': function() {
		$('#top-bar').removeClass('expanded');
	}
})