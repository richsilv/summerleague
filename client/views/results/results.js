var resultsSub,
    filterFields = {
      fieldInfo: [],
      dep: new Deps.Dependency()
    },
    longKeys = [
      ['Race', 'Race'],
      ['Pos', 'Pos'],
      ['Last Name', 'Last Name'],
      ['First Name', 'First Name'],
      ['Club', 'Club'],
      ['Gender', 'Gender'],
      ['Cat', 'Cat'],
      ['Date', 'Date'],
      ['Distance', 'Distance'],
      ['Time', 'Time'],
      ['Age Grade', 'Age Grade']
    ],
    shortKeys = [
      ['Race', 'Race'],
      ['Pos', 'Pos'],
      ['Last Name', 'Last Name'],
      ['First Name', 'First Name'],
      ['Club', 'Club'],
      ['Time', 'Time']
    ];

Template.resultsTable.helpers({
  results: function() {
    return Results.find();
  }
});

Template.resultsTable.rendered = function() {
 // var tableCB = Meteor.setInterval(function() {
 //    var results = Results.find().fetch(), tableData = [], columns = [],
 //        keys = (window.innerWidth > 600) ? longKeys : shortKeys;
 //    if (results.length) {
 //      results.forEach(function(row) { 
 //        var thisRow = [];
 //        keys.forEach( function(k) {
 //          thisRow.push(row[k[0]]);
 //        });
 //        tableData.push(thisRow);
 //      });
 //      keys.forEach(function(k) {
 //        columns.push({"sTitle": k[1]});
 //      });
 //     Meteor.clearInterval(tableCB);
 //      sTable = $('#resultsTable').dataTable({
 //        "aaData": tableData,
 //        "aoColumns": columns,
 //        "iDisplayLength": 20,
 //        "bPaginate": true,
 //        "iCookieDuration": 60, 
 //        "bStateSave": false,
 //        "bAutoWidth": false,
 //        "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
 //        "fnInitComplete": function() {
 //          $('#resultsTable').wrap('<div class="scrollStyle" />');
 //          $(this).css('visibility', 'visible');
 //        }
 //      });
 //    }
 // }, 250);
  getFilters();  
  resultsSub = Meteor.subscribe("results", {});
};

Template.tableControls.helpers({
  fields: function() {
    filterFields.dep.depend();
    return filterFields.fieldInfo;
  }
});

Template.tableControls.events({
  'click .f-dropdown': function(event) {
    var filter = {};
    filter[$(event.target).parents('ul').attr('id')] = event.target.innerHTML;
    getResults(filter);
  }
});

function getResults(filter) {
  resultsSub.stop();
  resultsSub = Meteor.subscribe("results", filter);
}

function getFilters() {
  Meteor.call('getFilters', ['Date', 'Cat', 'Club'], function(err, res) {
    if (err)
      console.log(err);
    else {
      filterFields.fieldInfo = res;
      filterFields.dep.changed();
      Deps.flush();
      $(document).foundation();
    }
  });
}