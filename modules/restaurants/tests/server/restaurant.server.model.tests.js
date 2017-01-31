'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Restaurant = mongoose.model('Restaurant');

/**
 * Globals
 */
var user, restaurant;

/**
 * Unit tests
 */
describe('Restaurant Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      restaurant = new Restaurant({
        name: 'Restaurant Title',
        cuisine: 'Restaurant Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return restaurant.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      restaurant.name = '';

      return restaurant.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Restaurant.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
