'use strict';

/**
 * Module dependencies.
 */
var restaurantsPolicy = require('../policies/restaurants.server.policy'),
  restaurants = require('../controllers/restaurants.server.controller');

module.exports = function (app) {
  // Restaurants collection routes
  app.route('/api/restaurants').all(restaurantsPolicy.isAllowed)
    .get(restaurants.list)
    .post(restaurants.create);

  // Single restaurant routes
  app.route('/api/restaurants/:restaurantId').all(restaurantsPolicy.isAllowed)
    .get(restaurants.read)
    .put(restaurants.update)
    .delete(restaurants.delete);

  // Finish by binding the restaurant middleware
  app.param('restaurantId', restaurants.restaurantByID);
};
