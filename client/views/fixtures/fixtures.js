var mapComputation;

Template.fixturesTemplate.helpers({
	fixtures: function() {
		var currentId = this._id;
		return Fixtures.find({}, {
			sort: {dateTime: 1},
			transform: function(doc) {
		    if (doc._id === currentId)
		    	doc.activeRace = true;
			return doc;
		}});
	},
	currentFixture: function() {
	}
})

// ****************************************

Template.fixtureData.helpers({
	dateTimeFormatted: function() {
		return moment(this.dateTime).format(" h:mm a on dddd, MMMM Do YYYY");
	}
});

Template.fixtureData.rendered = function() {
	mapComputation = Tracker.autorun(function() {
		mapRender(Router.current().data());
	});
};

Template.fixtureData.destroyed = function() {
	mapComputation.stop();
};

// ****************************************

function addGPX(filename, callback) {
	Meteor.call('getGPXS3', filename, function(err, res) {
		if (!err) {
			window.raceRoute = new L.GPX(res, {
				async: true,
				marker_options: {
				    startIconUrl: '/start-race.png',
				    endIconUrl: '/finish-race.png',
				    shadowUrl: '/pin-shadow.png'
  				}
			}).on('loaded', function(e) {
		 		window.map.fitBounds(e.target.getBounds());
		 		callback && callback.apply(this, arguments);
			}).addTo(window.map);
		}
		else
			console.log(err);
	});
}

function mapRender(mapDetails) {
	if (window.map) {
		window.map = null;
		$('#map').remove();
	}
	if (!mapDetails.gpx)
		return false;
    var query,
      	OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
		}),
		mapCenter = mapDetails.mapCenter,
		mapZoom = mapDetails.mapZoom;
	// UI.materialize(HTML.DIV({id: 'map'}), $('#mapHolder')[0]);
  $('#mapHolder').append('<div id="map"></div>');
	L.Icon.Default.imagePath = 'packages/leaflet/images';
	window.map = L.map('map', {
  		doubleClickZoom: false
	});
	OpenStreetMap_HOT.addTo(window.map);
	addGPX(mapDetails.gpx, function() {
		_.each(mapDetails.markers, function(marker) {
			L.marker(marker.LatLng, {
				icon: L.icon({
					iconUrl: marker.options.icon,
					iconSize: [32, 37],
					iconAnchor: [16, 37]
				}),
				title: marker.options.title
			}).addTo(window.map);
		});
	});
}
