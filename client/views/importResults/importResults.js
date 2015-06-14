Template.importResults.onCreated(function() {

  var tpl = this;
  tpl.resultsFiles = new ReactiveVar();

  Meteor.call('getResultsAvailable', function(err, res) {
    if (err) console.log(err);
    else tpl.resultsFiles.set(res);
  });

});

Template.importResults.helpers({

  resultsFiles: function() {
    return Template.instance().resultsFiles.get();
  }

});

Template.importResults.events({

  'click [data-action="import-results"]': function() {
    AntiModals.overlay('importModal', {
      data: this
    });
  }

});

Template.importModal.events({

  'click [data-action="import"]': function() {
    Meteor.call('processResults', this.Key, function(err, res) {
      AntiModals.dismissAll();
      console.log(res);
      Meteor.setTimeout(function() {
        if (err) AntiModals.overlay('failureModal', {data: {err: err}});
        else AntiModals.overlay('successModal', {data: {resultCount: res}});
      }, 500);
    });
  }

});
