var fs = Meteor.npmRequire('fs'),
		Future = Npm.require('fibers/future');

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
		var list = s3.listObjectsSync({Bucket: AppVars.AWSBucket, Prefix: 'photos/'});
		return list;
	},
	getGPXS3: function(filename) {
		var fut = new Future();
		if (filename)
			s3.getObject({ Bucket: AppVars.AWSBucket, Key: 'gpx/' + filename }, function(err, data) {
	    	if (!err)
	        fut.return(data.Body.toString());
				else throw new Meteor.Error(err);
			});
		else fut.return(null);
		return fut.wait();
	},
	getResultsAvailable: function() {
		var list = s3.listObjectsSync({Bucket: AppVars.AWSBucket, Prefix: 'results/'});
		if (list) return _.filter(list.Contents, function(item) { return item.Size; });
	},
	processResults: function(filename, raceName) {
		var fut = new Future();
		if (filename)
			s3.getObject({ Bucket: AppVars.AWSBucket, Key: filename }, Meteor.bindEnvironment(function(err, data) {
	    	if (!err) {
					var results = CSVtoJSON(data.Body.toString(), raceName);
					_.forEach(results, function(result) {
						Results.insert(result);
					});
					fut.return(results.length);
				}
				else throw new Meteor.Error(err);
			}));
		else fut.return(null);
		return fut.wait();
	},
	insertResults: function(results, password) {
		if (password !== Meteor.settings.password) return false;
		if (typeof results === "string") {
		}
		else {
			_.each(results, function(res) {Results.insert(res);});
			return true;
		}
	}
});

var getCSV = function(filename, callback) {
	Meteor.call('getCSV', filename, function(err, res) {
		if (err)
			console.log(err);
		else
			callback(res);
	});
};

var CSVtoJSON = function(data, raceName) {
	var lines = data.split('\n'),
		headers = lines.shift().split(','),
		results = lines.map(function(l) {
			var d = l.split(','),
				e = {};
			d.forEach(function(x, i) {
				e[headers[i]] = (headers[i] === 'Pos') ? parseInt(x, 10) : x;
			});
			if (raceName)
				e.Race = raceName;
			return e.Pos ? e : null;
		});
	return results;
};
