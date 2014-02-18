getCSV = function(filename, callback) {
	Meteor.call('getCSV', filename, function(err, res) {
		if (err)
			console.log(err);
		else
			callback(res);
	});
}

CSVtoJSON = function(data, raceName) {
	var lines = data.split('\n'),
		headers = lines.shift().split(','),
		results = lines.map(function(l) {
			var d = l.split(','),
				e = {};
			d.forEach(function(x, i) {
				e[headers[i]] = x;
			});
			if (raceName)
				e.Race = raceName;
			return e;
		});
	return results
}