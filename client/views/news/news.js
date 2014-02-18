Template.newsTemplate.helpers({
	dateTimeFormatted: function() {
		return moment(this.dateTime).format("dddd, MMMM Do YYYY");
	}
});