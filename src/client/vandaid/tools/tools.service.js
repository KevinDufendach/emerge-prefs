(function () {
  'use strict';

  angular
    .module('va.tools')
    .factory('vaTools', appTools);

  function appTools() {
    var service = {
      arrayConstructor: arrayConstructor,
      get: get
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

    /**
     * Gets a specified url-encoded parameter
     *
     * @param param {string} the url-encoded parameter desired
     * @returns {string} the value of the parameter. Returns undefined if not found.
     */
    function get(param){
      var result;
      if(result=(new RegExp('[?&]'+encodeURIComponent(param)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(result[1]);
    }
  }
})();