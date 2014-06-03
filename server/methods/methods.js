fs = Meteor.require('fs');
var s3;

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
	getFilters: function(fieldList, filter) {
		var results = Results.find(filter).fetch(),
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
	},
	connectAWS: function() {
		AWS.config.update(Meteor.settings.AWS);
		s3 = new AWS.S3();
		return s3.endpoint.protocol + '//' + AppVars.AWSBucket + '.' + s3.endpoint.host + '/';
	},
	listPhotos: function() {
		list = s3.listObjectsSync({Bucket: AppVars.AWSBucket, Prefix: 'photos/'});
		return list;
	},
	insertResults: function(results, password) {
		if (password !== SecureData.findOne({name: "password"}).value) return false;
		if (typeof results === "string") {
		}
		else {
			_.each(results, function(res) {Results.insert(res);});
			return true;
		}
	}
});