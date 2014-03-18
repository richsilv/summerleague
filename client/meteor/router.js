Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loading'
});

Router.map(function () {

  this.route('main', {
    path: '/',

    load: function () {
      // called on first load
    },

    waitOn: function () {
      return Meteor.subscribe('fixtures');
    },

    // before hooks are run before your action
    before: [
/*      function () {
        this.subscribe('post', this.params._id).wait();
        this.subscribe('posts'); // don't wait
      },*/

/*      function () {
        // we're done waiting on all subs
        if (this.ready()) {
          NProgress.done(); 
        } else {
          NProgress.start();
          this.stop(); // stop downstream funcs from running
        }
      }*/
    ],

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('mainSection', {to: 'mainSection'});  
    },

    unload: function () {
      // before a new route is run
    }
  });

  // ******************************************************************

  this.route('about', {
    path: '/about',

    waitOn: function () {
      return Meteor.subscribe('fixtures');
    },

    action: function () {
      this.redirect('about/history')
    }
  });

  this.route('about/history', {
    path: '/about/history',

    waitOn: function () {
      return Meteor.subscribe('fixtures');
    },

    data: function() {
      return StaticData.findOne({name: 'history'});
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('aboutTemplate', {to: 'mainSection'});
      this.render('history', {to: 'aboutSection'});
    }
  });

  this.route('about/rules', {
    path: '/about/rules',

    waitOn: function () {
      return Meteor.subscribe('fixtures');
    },

    data: function() {
      return StaticData.findOne({name:'rules'});
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('aboutTemplate', {to: 'mainSection'});
      this.render('rules', {to: 'aboutSection'});
    }
  });

  this.route('about/photos', {
    path: '/about/photos',

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('aboutTemplate', {to: 'mainSection'});
      this.render('photos', {to: 'aboutSection'});
    }
  });

  this.route('about/clubs', {
    path: '/about/clubs',

    data: function() {
      return Clubs.find();
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('aboutTemplate', {to: 'mainSection'});
      this.render('clubs', {to: 'aboutSection'});
    }
  });

  // ******************************************************************

  this.route('news', {
    path: '/news',

    data: function() {
      return News.find({}, {sort: {dateTime: -1}, limit: 5});
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('newsTemplate', {to: 'mainSection'});
    }
  });

  // ******************************************************************

  this.route('fixtureSpecific', {
    path: '/fixtures/:url',

    data: function() {
      return Fixtures.findOne({url: this.params.url});
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('main', {to: 'mainYield'});
      this.render('sideBar', {to: 'sideBar'});
      this.render('fixturesTemplate', {to: 'mainSection'});
      this.render('fixtureData', {to: 'fixtureSection'});
    }
  });

  this.route('fixtures', {
    path: '/fixtures',

    action: function () {
      var fixture = Fixtures.findOne();
      if (fixture)
        this.redirect('fixtureSpecific', {url: fixture.url});
    }
  });

  // ******************************************************************

  this.route('results', {
    path: '/results',

    waitOn: function () {
      return Meteor.subscribe('results');
    },

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render(); // render all
      this.render('resultsTable', {to: 'mainYield'});
    }
  });

});