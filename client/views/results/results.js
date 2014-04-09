var longKeys = [
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

Template.resultsTable.rendered = function() {
 var tableCB = Meteor.setInterval(function() {
    var results = Results.find().fetch(), tableData = [], columns = [],
        keys = (window.innerWidth > 600) ? longKeys : shortKeys;
    if (results.length) {
      results.forEach(function(row) { 
        var thisRow = [];
        keys.forEach( function(k) {
          thisRow.push(row[k[0]]);
        });
        tableData.push(thisRow);
      });
      keys.forEach(function(k) {
        columns.push({"sTitle": k[1]});
      });
     Meteor.clearInterval(tableCB);
      sTable = $('#resultsTable').dataTable({
        "aaData": tableData,
        "aoColumns": columns,
        "iDisplayLength": 20,
        "bPaginate": true,
        "iCookieDuration": 60, 
        "bStateSave": false,
        "bAutoWidth": false,
        "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
        "fnInitComplete": function() {
          $('#resultsTable').wrap('<div class="scrollStyle" />');
          $(this).css('visibility', 'visible');
        }
      });
    }
 }, 250);
}