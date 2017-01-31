'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Restaurant = mongoose.model('Restaurant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, restaurant;

/**
 * Restaurant routes tests
 */
describe('Restaurant CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new restaurant
    user.save(function () {
      restaurant = {
        name: 'Restaurant Title',
        cuisine: 'Restaurant Content'
      };

      done();
    });
  });

  it('should be able to save an restaurant if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Get a list of restaurants
            agent.get('/api/restaurants')
              .end(function (restaurantsGetErr, restaurantsGetRes) {
                // Handle restaurant save error
                if (restaurantsGetErr) {
                  return done(restaurantsGetErr);
                }

                // Get restaurants list
                var restaurants = restaurantsGetRes.body;

                // Set assertions
                (restaurants[0].user._id).should.equal(userId);
                (restaurants[0].name).should.match('Restaurant Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an restaurant if not logged in', function (done) {
    agent.post('/api/restaurants')
      .send(restaurant)
      .expect(403)
      .end(function (restaurantSaveErr, restaurantSaveRes) {
        // Call the assertion callback
        done(restaurantSaveErr);
      });
  });

  it('should not be able to save an restaurant if no name is provided', function (done) {
    // Invalidate name field
    restaurant.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(400)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Set message assertion
            (restaurantSaveRes.body.message).should.match('Title cannot be blank');

            // Handle restaurant save error
            done(restaurantSaveErr);
          });
      });
  });

  it('should be able to update an restaurant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Update restaurant name
            restaurant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing restaurant
            agent.put('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantUpdateErr, restaurantUpdateRes) {
                // Handle restaurant update error
                if (restaurantUpdateErr) {
                  return done(restaurantUpdateErr);
                }

                // Set assertions
                (restaurantUpdateRes.body._id).should.equal(restaurantSaveRes.body._id);
                (restaurantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of restaurants if not signed in', function (done) {
    // Create new restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the restaurant
    restaurantObj.save(function () {
      // Request restaurants
      request(app).get('/api/restaurants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single restaurant if not signed in', function (done) {
    // Create new restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the restaurant
    restaurantObj.save(function () {
      request(app).get('/api/restaurants/' + restaurantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', restaurant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single restaurant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/restaurants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Restaurant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single restaurant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent restaurant
    request(app).get('/api/restaurants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No restaurant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an restaurant if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new restaurant
        agent.post('/api/restaurants')
          .send(restaurant)
          .expect(200)
          .end(function (restaurantSaveErr, restaurantSaveRes) {
            // Handle restaurant save error
            if (restaurantSaveErr) {
              return done(restaurantSaveErr);
            }

            // Delete an existing restaurant
            agent.delete('/api/restaurants/' + restaurantSaveRes.body._id)
              .send(restaurant)
              .expect(200)
              .end(function (restaurantDeleteErr, restaurantDeleteRes) {
                // Handle restaurant error error
                if (restaurantDeleteErr) {
                  return done(restaurantDeleteErr);
                }

                // Set assertions
                (restaurantDeleteRes.body._id).should.equal(restaurantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an restaurant if not signed in', function (done) {
    // Set restaurant user
    restaurant.user = user;

    // Create new restaurant model instance
    var restaurantObj = new Restaurant(restaurant);

    // Save the restaurant
    restaurantObj.save(function () {
      // Try deleting restaurant
      request(app).delete('/api/restaurants/' + restaurantObj._id)
        .expect(403)
        .end(function (restaurantDeleteErr, restaurantDeleteRes) {
          // Set message assertion
          (restaurantDeleteRes.body.message).should.match('User is not authorized');

          // Handle restaurant error error
          done(restaurantDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Restaurant.remove().exec(done);
    });
  });
});
