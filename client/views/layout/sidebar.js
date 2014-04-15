Template.fixtureSummary.helpers({
	fixtures: function() {
		return Fixtures.find({}, {sort: {dateTime: 1}});
	},
	dateTimeFormatted: function() {
		if (this.dateTime instanceof Date)
			return moment(this.dateTime).format(" h:mm a, D MMM YY");
		else
			return "TBC";
	}
});

Template.photoSelection.helpers({
	photoSelection: function() {
		AppVars.Photos.dep.depend();
		return AppVars.Photos.photoList.slice(0,3);
	}
});

// ******************************