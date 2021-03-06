Template.photos.helpers({
	photoList: function() {
		AppVars.Photos.dep.depend();
		return AppVars.Photos.photoList.map(function(val, ind) {return {photo: val, index: ind};});
	}
});

Template.photos.events({
	'click #links a': function(evt, tmp) {
		evt.preventDefault();
    var options = {index: evt.currentTarget, event: evt};
    blueimp.Gallery([evt.currentTarget.href], options);
	}
});

// ******************************

Template.photoModal.events({
	'click .close-reveal-modal': function() {
		$('#photoModal').foundation('reveal', 'close');
	}
});

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
