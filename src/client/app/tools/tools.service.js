(function () {
  'use strict';

  angular
    .module('app.tools')
    .factory('appTools', appTools);

  function appTools() {
    var service = {
      arrayConstructor: arrayConstructor
    };
    return service;

    //////////////

    /**
     * Constructs an array of objects based on a set of prototypes and a constructor function
     *
     * @param prototypes contain the prototypical objects used in the constructor
     * @param constructorFn
     * @returns {Array}
     */
    function arrayConstructor(prototypes, constructorFn) {
      var i, len;
      var result = [];
      for (i = 0, len=prototypes.length; i < len; i++) {
        result.push(new constructorFn(prototypes[i]));
      }
      return result;
    }
  }
})();