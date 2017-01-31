'use strict';

// Setting up route
angular.module('restaurants').config(['$stateProvider',
  function ($stateProvider) {
    // Restaurants state routing
    $stateProvider
      .state('restaurants', {
        abstract: true,
        url: '/restaurants',
        template: '<ui-view/>'
      })
      .state('restaurants.list', {
        url: '',
        templateUrl: 'modules/restaurants/client/views/list-restaurants.client.view.html'
      })
      .state('restaurants.create', {
        url: '/create',
        templateUrl: 'modules/restaurants/client/views/create-restaurant.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('restaurants.view', {
        url: '/:restaurantId',
        templateUrl: 'modules/restaurants/client/views/view-restaurant.client.view.html'
      })
      .state('restaurants.edit', {
        url: '/:restaurantId/edit',
        templateUrl: 'modules/restaurants/client/views/edit-restaurant.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
