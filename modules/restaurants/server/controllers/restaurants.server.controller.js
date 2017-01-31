'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Restaurant = mongoose.model('Restaurant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a restaurant
 */
exports.create = function (req, res) {
  var restaurant = new Restaurant(req.body);
  restaurant.user = req.user;

  restaurant.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(restaurant);
    }
  });
};

/**
 * Show the current restaurant
 */
exports.read = function (req, res) {
  res.json(req.restaurant);
};

/**
 * Update a restaurant
 */
exports.update = function (req, res) {
  var restaurant = req.restaurant;

  restaurant.name = req.body.name;
  restaurant.cuisine = req.body.cuisine;

  restaurant.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(restaurant);
    }
  });
};

/**
 * Delete an restaurant
 */
exports.delete = function (req, res) {
  var restaurant = req.restaurant;

  restaurant.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(restaurant);
    }
  });
};

/**
 * List of Restaurants
 */
exports.list = function (req, res) {
  Restaurant.find().sort('-created').limit(5).exec(function (err, restaurants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(restaurants);
    }
  });
};

/**
 * Restaurant middleware
 */
exports.restaurantByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Restaurant is invalid'
    });
  }

  Restaurant.find({ '_id': id }).exec(function (err, restaurant) {
    if (err) {
      return next(err);
    } else if (!restaurant) {
      return res.status(404).send({
        message: 'No restaurant with that identifier has been found'
      });
    }
    req.restaurant = restaurant;
    next();
  });
};
