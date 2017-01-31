'use strict';

describe('Restaurants E2E Tests:', function () {
  describe('Test restaurants page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/restaurants');
      expect(element.all(by.repeater('restaurant in restaurants')).count()).toEqual(0);
    });
  });
});
