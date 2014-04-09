var photoList = {
		photos: [],
		dep: new Deps.Dependency(),
		index: 0,
		number: 0
	}, photoComputation;

// ******************************

Template.photos.helpers({
	photoList: function() {
		photoList.dep.depend();
		return photoList.photos.map(function(val, ind) {return {photo: val, index: ind};});
	}
});

Template.photos.events({
	'click .thumbnail': function(event) {
		var thisPhoto = photoList.photos[event.target.attributes.data.value],
			frag = UI.renderWithData(Template.photoModal, {src: '/photos/' + thisPhoto});
		UI.insert(frag, document.body);
		$(document).foundation();
		$(document).on('closed', '[data-reveal]', function () {
  			$(this).remove();
		});
		$(document).on('opened', '[data-reveal]', function () {
			repositionModal();
		});	
		$('#photoModal').foundation('reveal', 'open');
	}
})

Template.photos.rendered = function() {
	photoComputation = Deps.autorun(getPhotos);
};

Template.photos.destroyed = function() {
	photoComputation.stop();
};

// ******************************

Template.photoModal.events({
	'click .foundicon-left-arrow': function() {
		photoList.index = (photoList.index + photoList.number - 1) % photoList.number;
		var thisPhoto = photoList.photos[photoList.index];
		document.querySelector('#photoBox').src = '/photos/' + thisPhoto;
		if (window.innerWidth > 600) repositionModal(1);
	},
	'click .foundicon-right-arrow': function() {
		photoList.index = (photoList.index + 1) % photoList.number;
		var thisPhoto = photoList.photos[photoList.index];
		document.querySelector('#photoBox').src = '/photos/' + thisPhoto;
		if (window.innerWidth > 600) repositionModal(1);
	},
	'click .close-reveal-modal': function() {
		$('#photoModal').foundation('reveal', 'close');
	}
})

// ******************************

function repositionModal(delay) {
	var photoBox = $('#photoBox'),
		photoModal = $('#photoModal'),
		innerWidth = window.innerWidth;
	Meteor.setTimeout(function() {
		if (innerWidth < 600) {
			photoModal.css('width', '100%');
			photoModal.css('margin-left', '0');
			photoModal.css('left', '0');
		}
		else {
			if (photoBox[0].offsetWidth > innerWidth - 250)
				photoModal.css('width', innerWidth - 250);
			else if (photoBox[0].offsetWidth > 800)
				photoModal.css('width', '800');
			else if (photoBox[0].naturalWidth < innerWidth - 250)
				photoModal.css('width', '');
			photoModal.css('margin-left', (- photoBox[0].offsetWidth - 174) / 2 + 'px');
		}
	}, delay);
}

function getPhotos() {
	photoList.dep.depend();
	Meteor.call('getPhotos', function(err, res) {
		if (!err) {
			photoList.photos = res;
			photoList.number = res.length;
			photoList.dep.changed();
		}
		else
			console.log(err);
	});	
}