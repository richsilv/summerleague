Template.fixturesTemplate.helpers({
	fixtures: function() {
		var currentId = this._id;
		return Fixtures.find({}, {transform:function(doc) {
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
    var query,
      	_this = this,
      	OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
		}),
		mapCenter = this.data.mapCenter,
		mapZoom = this.data.mapZoom;
	if (window.map) {
		window.map.remove();
		$('#map').remove();
	}
	document.querySelector('#mapHolder').appendChild(DIV({id: 'map'}));
    L.Icon.Default.imagePath = 'packages/leaflet/images';
	window.map = L.map('map', {
  		doubleClickZoom: false
	});
	OpenStreetMap_HOT.addTo(window.map);
	addGPX(this.data.gpx);
};

addGPX = function(filename) {
	Meteor.call('getGPX', filename, function(err, res) {
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
			}).addTo(window.map);
		}
		else
			console.log(err);
	});
}