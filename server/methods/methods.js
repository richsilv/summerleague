fs = Meteor.require('fs');

Meteor.methods({
	getGPX: function(filename) {
		return Assets.getText(filename);
	},
	getPhotos: function() {
	    var files = fs.readdirSync('./../client/app/photos').map(function(f) {
	    	return f.substr(f.lastIndexOf('/')+1);
	    });
	    return files;
	},
	getCSV: function(filename) {
		return Assets.getText(filename);
	}	
});