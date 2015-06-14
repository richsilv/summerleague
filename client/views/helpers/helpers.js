Template.registerHelper("route", function(name) {
	return name === Router.current().route.name;
});

Template.registerHelper("route1", function(name) {
	return Router.current().route.name.search('/') >= 0 ? name === Router.current().route.name.substr(0, Router.current().route.name.search('/')) : name === Router.current().route.name;
});

Template.registerHelper("stripProtocol", function(url) {
	return url.replace(/.*?:\/\//g, "");
});

Template.registerHelper("dateFormat", function(date, format) {
	return moment(date).format(format);
});
