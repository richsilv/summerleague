fs = Meteor.require('fs');

Meteor.methods({
	getGPX: function(filename) {
		if (filename)
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
	},
	getFilters: function(fieldList) {
		var results = Results.find().fetch(),
			fieldInfo = [];
		for (var i = 0; i < fieldList.length; i++) {
			var options = [];
			results.forEach(function(r) {
				if (options.indexOf(r[fieldList[i]]) === -1) options.push(r[fieldList[i]]);
			});
			options.sort().unshift('All');
			fieldInfo.push({fieldName: fieldList[i], options: options});
		}
		return fieldInfo;
	},
	resultsCount: function(filter) {
		return Results.find(filter).count();
	}
});