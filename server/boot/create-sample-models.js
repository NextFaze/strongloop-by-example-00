var async = require('async');
module.exports = function(app) {
  //data sources
  var postgresDs = app.dataSources.postgresDs;
  //create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    apps: async.apply(createApps),
  }, function(err, results) {
    if (err) throw err;
    createReviews(results.reviewers, results.apps, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create reviewers
  function createReviewers(cb) {
    postgresDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {email: 'steve@app.com',  password: 'steveapp'},
        {email: 'bill@app.com',   password: 'billapp'},
        {email: 'sundar@app.com', password: 'sundarapp'}
      ], cb);
    });
  }
  //create apps
  function createApps(cb) {
    postgresDs.automigrate('App', function(err) {
      if (err) return cb(err);
      var App = app.models.App;
      App.create([
        {name: 'Fartotron'},
        {name: 'Wishomatic'},
        {name: 'iPerfect'},
      ], cb);
    });
  }
  //create reviews
  function createReviews(reviewers, apps, cb) {
    postgresDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'Great for clearing a room.',
          publisherId: reviewers[0].id,
          appId: apps[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Best one so far.',
          publisherId: reviewers[1].id,
          appId: apps[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'I think my wish came true but its hard to tell.',
          publisherId: reviewers[1].id,
          appId: apps[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 1,
          comments: 'I have not been made perfect. Fail.',
          publisherId: reviewers[2].id,
          appId: apps[2].id,
        }
      ], cb);
    });
  }
};
