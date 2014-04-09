var photoList = {
		photos: [],
		dep: new Deps.Dependency(),
		index: 0,
		number: 0
	}

// ******************************

Template.photos.helpers({
	photoList: function() {
		return photoList.photos.map(function(val, ind) {return {photo: val, index: ind};});
	}
});

Template.photos.events({
	'click .thumbnail': function(event) {
		var thisPhoto = photoList.photos[event.target.attributes.data.value],
			frag = UI.renderWithData(Template.photoModal, {src: '/photos/' + thisPhoto});
		UI.insert(frag, document.body);
		$(document).foundation();
		$('#photoModal').foundation('reveal', 'open');
		$(document).on('closed', '[data-reveal]', function () {
  			$(this).remove();
		});
		$(document).on('opened', '[data-reveal]', function () {
			repositionModal();
		});
	}
})

// ******************************

Template.photoModal.events({
	'click .foundicon-left-arrow': function() {
		photoList.index = (photoList.index + photoList.number - 1) % photoList.number;
		var thisPhoto = photoList.photos[photoList.index];
		document.querySelector('#photoBox').src = '/photos/' + thisPhoto;
		repositionModal(1);
	},
	'click .foundicon-right-arrow': function() {
		photoList.index = (photoList.index + 1) % photoList.number;
		var thisPhoto = photoList.photos[photoList.index];
		document.querySelector('#photoBox').src = '/photos/' + thisPhoto;
		repositionModal(1);
	},
	'click .close-reveal-modal': function() {
		$('#photoModal').foundation('reveal', 'close');
	}
})

// ******************************

Deps.autorun(function() {
	photoList.dep.depend();
	Meteor.call('getPhotos', function(err, res) {
		if (!err) {
			photoList.photos = res;
			photoList.number = res.length;
		}
		else
			console.log(err);
	});
});

// ******************************

function repositionModal(delay) {
	var photoBox = $('#photoBox'),
		photoModal = $('#photoModal'),
		innerWidth = window.innerWidth;
	Meteor.setTimeout(function() {
		if (photoBox[0].offsetWidth > innerWidth - 250)
			photoBox.attr('width', innerWidth - 250);
		else if (photoBox[0].offsetWidth > 800)
			photoBox.attr('width', '800');
		else if (photoBox[0].naturalWidth < innerWidth - 250)
			photoBox.attr('width', '');
		photoModal.css('margin-left', (- photoBox[0].offsetWidth - 174) / 2 + 'px');
	}, delay);
}