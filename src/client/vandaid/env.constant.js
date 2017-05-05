(function() {
  'use strict';

  var va = {};

  // Import variables if present (from env.js)
  if(window){
    Object.assign(va, window.__va);
  }


// Register environment in AngularJS as constant
  angular
    .module('va.constants')
    .constant('__va', va);

})();