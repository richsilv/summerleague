Meteor.publish("results", function(filter, limit) {
	return Results.find(filter, {sort: {'Date': 1, Pos: 1}, limit: limit ? limit : 25});
});

Meteor.publish("fixtures", function() {
	return Fixtures.find();
});

Meteor.publish("clubs", function() {
	return Clubs.find();
});

Meteor.publish("staticdata", function() {
	return StaticData.find();
});

Meteor.publish("news", function() {
	return News.find();
});