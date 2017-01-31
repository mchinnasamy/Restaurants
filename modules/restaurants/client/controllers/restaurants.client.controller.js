'use strict';

// Restaurants controller
angular.module('restaurants').controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Restaurants',
  function ($scope, $stateParams, $location, Authentication, Restaurants) {
    $scope.authentication = Authentication;

    // Create new Restaurant
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'restaurantForm');

        return false;
      }

      // Create new Restaurant object
      var restaurant = new Restaurants({
        name: this.name,
        cuisine: this.cuisine
      });

      // Redirect after save
      restaurant.$save(function (response) {
        $location.path('restaurants/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.cuisine = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Restaurant
    $scope.remove = function (restaurant) {
      if (restaurant) {
        restaurant.$remove();

        for (var i in $scope.restaurants) {
          if ($scope.restaurants[i] === restaurant) {
            $scope.restaurants.splice(i, 1);
          }
        }
      } else {
        $scope.restaurant.$remove(function () {
          $location.path('restaurants');
        });
      }
    };

    // Update existing Restaurant
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'restaurantForm');

        return false;
      }

      var restaurant = $scope.restaurant;

      restaurant.$update(function () {
        $location.path('restaurants/' + restaurant._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Restaurants
    $scope.find = function () {
      $scope.restaurants = Restaurants.query();
    };

    // Find existing Restaurant
    $scope.findOne = function () {
      $scope.restaurant = Restaurants.get({
        restaurantId: $stateParams.restaurantId
      });
    };
  }
]);
