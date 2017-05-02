(function() {
  'use strict';

  var env = {};

  // Import variables if present (from env.js)
  if(window){
    Object.assign(env, window.__env);
  }


// Register environment in AngularJS as constant
  angular
    .module('app')
    .constant('__env', env);

})();