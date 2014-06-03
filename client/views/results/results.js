var resultsSub,
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
  },
  smallScreen: function() {
    return screen.width <= 640;
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
  getFilters(filter);  
  getResults(filter, skip);
};

Template.tableControls.helpers({
  fields: function() {
    filterFields.dep.depend();
    return filterFields.fieldInfo;
  },
  currentChoice: function() {
    if (this.options.length < 3) return this.options[1];
    else return this.fieldName;
  },
  pages: function() {
    var pages = [], thisItem, dotGap = false, lastPage = Math.floor((resultsCount.value / AppVars.resultLength) + 1);
    resultsCount.dep.depend();
    pages.push({class: skip === 0 ? 'arrow unavailable' : 'leftHand arrow', content: '&laquo;'});
    for (var i = 1; i <= lastPage; i++) {
      if ((Math.abs((skip / AppVars.resultLength) - i + 1) < 2) || (i === 1) || (i === lastPage)) {
        thisItem = {class: ((skip / AppVars.resultLength) === i - 1) ? 'current number' : 'number', content: i};
        pages.push(thisItem);
        dotGap = false;
      }
      else {
        if (!dotGap) {
          pages.push({class: 'unavailable', content: '&hellip;'});
          dotGap = true;
        }
      }
    }
    pages.push({class: (resultsCount.value - skip) < AppVars.resultLength ? 'arrow unavailable' : 'rightHand arrow', content: '&raquo;'});
    return pages;
  }
});

Template.tableControls.events({
  'click .f-dropdown': function(event) {
    var jqItem = $(event.target),
        chosen = _.unescape(jqItem.html()),
        dropdown = jqItem.parents('.f-dropdown').prevAll('.button.dropdown');
    if (chosen !== 'All') {
      filter[jqItem.parents('ul').attr('id')] = chosen;
    }
    else {
      delete filter[jqItem.parents('ul').attr('id')];
    }
    skip = 0;
    getFilters(filter);
    getResults(filter, skip);
    jqItem.parents('.f-dropdown').removeClass('open').css('left', '-99999px');
  },
  'click .number': function(event) {
    var pageNum = parseInt($(event.currentTarget).children('a').html(), 10);
    skip = (pageNum - 1) * AppVars.resultLength;
    getResults(filter, skip);
  },
  'click .leftHand': function() {
    skip -= AppVars.resultLength;
    getResults(filter, skip);
  },
  'click .rightHand': function() {
    skip += AppVars.resultLength;
    getResults(filter, skip);
  }
});

getResults = function(filter, skip) {
  if (resultsSub) resultsSub.stop();
  resultsSub = Meteor.subscribe("results", filter, skip);
  Meteor.call('resultsCount', filter, function(err, res) {
    if (err)
      console.log(err);
    else {
      resultsCount.value = res;
      resultsCount.dep.changed();
    }
  });
}

getFilters = function(filter) {
  Meteor.call('getFilters', ['Race', 'Date', 'Cat', 'Club'], filter, function(err, res) {
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