'use strict';

(function () {
  // Restaurants Controller Spec
  describe('Restaurants Controller Tests', function () {
    // Initialize global variables
    var RestaurantsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Restaurants,
      mockRestaurant;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Restaurants_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Restaurants = _Restaurants_;

      // create mock restaurant
      mockRestaurant = new Restaurants({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'An Restaurant about MEAN',
        cuisine: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Restaurants controller.
      RestaurantsController = $controller('RestaurantsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one restaurant object fetched from XHR', inject(function (Restaurants) {
      // Create a sample restaurants array that includes the new restaurant
      var sampleRestaurants = [mockRestaurant];

      // Set GET response
      $httpBackend.expectGET('api/restaurants').respond(sampleRestaurants);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.restaurants).toEqualData(sampleRestaurants);
    }));

    it('$scope.findOne() should create an array with one restaurant object fetched from XHR using a restaurantId URL parameter', inject(function (Restaurants) {
      // Set the URL parameter
      $stateParams.restaurantId = mockRestaurant._id;

      // Set GET response
      $httpBackend.expectGET(/api\/restaurants\/([0-9a-fA-F]{24})$/).respond(mockRestaurant);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.restaurant).toEqualData(mockRestaurant);
    }));

    describe('$scope.create()', function () {
      var sampleRestaurantPostData;

      beforeEach(function () {
        // Create a sample restaurant object
        sampleRestaurantPostData = new Restaurants({
          name: 'An Restaurant about MEAN',
          cuisine: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.name = 'An Restaurant about MEAN';
        scope.cuisine = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Restaurants) {
        // Set POST response
        $httpBackend.expectPOST('api/restaurants', sampleRestaurantPostData).respond(mockRestaurant);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.name).toEqual('');
        expect(scope.cuisine).toEqual('');

        // Test URL redirection after the restaurant was created
        expect($location.path.calls.mostRecent().args[0]).toBe('restaurants/' + mockRestaurant._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/restaurants', sampleRestaurantPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock restaurant in scope
        scope.restaurant = mockRestaurant;
      });

      it('should update a valid restaurant', inject(function (Restaurants) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/restaurants\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/restaurants/' + mockRestaurant._id);
      }));

      it('should set scope.error to error response message', inject(function (Restaurants) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/restaurants\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(restaurant)', function () {
      beforeEach(function () {
        // Create new restaurants array and include the restaurant
        scope.restaurants = [mockRestaurant, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/restaurants\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRestaurant);
      });

      it('should send a DELETE request with a valid restaurantId and remove the restaurant from the scope', inject(function (Restaurants) {
        expect(scope.restaurants.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.restaurant = mockRestaurant;

        $httpBackend.expectDELETE(/api\/restaurants\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to restaurants', function () {
        expect($location.path).toHaveBeenCalledWith('restaurants');
      });
    });
  });
}());
