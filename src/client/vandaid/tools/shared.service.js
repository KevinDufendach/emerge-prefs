(function () {
  'use strict';

  angular
    .module('va.tools')
    .factory('$vaShared', SharedService);

  function SharedService() {
    var sharedVariables = {};

    return sharedVariables;
  }

})();