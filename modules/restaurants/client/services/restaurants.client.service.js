'use strict';

//Restaurants service used for communicating with the restaurants REST endpoints
angular.module('restaurants').factory('Restaurants', ['$resource',
  function ($resource) {
    return $resource('api/restaurants/:restaurantId', {
      restaurantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
