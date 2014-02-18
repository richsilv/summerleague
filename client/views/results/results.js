var keys = [['Race', 'Race'],
            ['Pos', 'Pos'],
            ['Surname', 'Surname'],
            ['Forename', 'Forename'],
            ['Club', 'Club'],
            ['Gender', 'Gender'],
            ['GenderPos', 'Gen Pos'],
            ['Category', 'Category'],
            ['CategoryPos', 'Cat Pos'],
            ['Gun Time', 'Gun Time'],
            ['Chip Time', 'Chip Time']];

Template.resultsTable.rendered = function() {
//  var tableCB = Meteor.setInterval(function() {
    var results = Results.find().fetch(), tableData = [], columns = [];
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
//      Meteor.clearInterval(tableCB);
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
//  }, 250);
}