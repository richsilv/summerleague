var resultsSub,
    filter = {},
    filterFields = {
      fieldInfo: [],
      dep: new Deps.Dependency()
    },
    resultsCount = {
      value: 0,
      dep: new Deps.Dependency()
    },
    skip = 0,
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
  getResults(filter, skip);
};

Template.tableControls.helpers({
  fields: function() {
    filterFields.dep.depend();
    return filterFields.fieldInfo;
  },
  pages: function() {
    var pages = [], thisItem;
    resultsCount.dep.depend();
    pages.push({class: 'arrow unavailable', content: '&laquo;'});
    for (var i = 1; i < (resultsCount.value / AppVars.resultLength) + 1; i++) {
      thisItem = {class: ((skip / AppVars.resultLength) === i - 1) ? 'current number' : 'number', content: i};
      pages.push(thisItem);
    }
    pages.push({class: 'arrow', content: '&raquo;'});
    return pages;
  }
});

Template.tableControls.events({
  'click .f-dropdown': function(event) {
    var jqItem = $(event.target),
        chosen = _.unescape(jqItem.html()),
        dropdown = jqItem.parents('.f-dropdown').prevAll('.button.dropdown');
    if (chosen !== 'All') {
      dropdown.html(chosen);
      filter[jqItem.parents('ul').attr('id')] = chosen;
    }
    else {
      dropdown.html(dropdown.attr('default'));
      delete filter[jqItem.parents('ul').attr('id')];
    }
    skip = 0;
    getResults(filter, skip);
  },
  'click .number': function(event) {
    var pageNum = parseInt($(event.currentTarget).children('a').html(), 10);
    skip = (pageNum - 1) * AppVars.resultLength;
    getResults(filter, skip);
  }
});

function getResults(filter, skip) {
  if (resultsSub) resultsSub.stop();
  resultsSub = Meteor.subscribe("results", filter);
  Meteor.call('resultsCount', filter, skip, function(err, res) {
    if (err)
      console.log(err);
    else {
      resultsCount.value = res;
      resultsCount.dep.changed();
    }
  });
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