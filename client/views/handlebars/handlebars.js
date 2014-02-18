Handlebars.registerHelper("route", function(name) {
	return name === Router.current().route.name;
});

Handlebars.registerHelper("route1", function(name) {
	return Router.current().route.name.search('/') >= 0 ? name === Router.current().route.name.substr(0, Router.current().route.name.search('/')) : name === Router.current().route.name;
});