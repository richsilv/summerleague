Meteor.publish("results", function() {
	return Results.find();
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