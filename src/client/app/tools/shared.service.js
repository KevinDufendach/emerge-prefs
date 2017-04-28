(function () {
  'use strict';


  angular
    .module('app.tools')
    .factory('$vaShared', SharedService);

  function SharedService() {
    var sharedVariables = {};

    return sharedVariables;
  }


})();