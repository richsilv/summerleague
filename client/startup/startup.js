AppVars.Photos = {
	dep: new Deps.Dependency(),
	photoList: []
};

Meteor.call('connectAWS', function(err, url) {
	if (err)
		console.log(err);
	else {
		Meteor.call('listPhotos', function(nextErr, photoResponse) {
			var photos = [];
			photoResponse.Contents.forEach(function(r) {
				if (r.Size > 0)
					photos.push(url + r.Key);
			});
			AppVars.Photos.photoList = photos;
			AppVars.Photos.dep.changed();
		});
	}
});

Houston.menu({
	type: 'template',
	use: 'importResults',
	title: 'Import Results'
});
