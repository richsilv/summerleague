var sidebarPhotoList = [],
	sidebarPhotoFlag = new Deps.Dependency();

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
		return sidebarPhotoList.slice(0, 3); 
	}
});

// ******************************

Deps.autorun(function() {
	sidebarPhotoFlag.depend();
	Meteor.call('getPhotos', function(err, res) {
		if (!err)
			sidebarPhotoList = res;
		else
			console.log(err);
	});
});
