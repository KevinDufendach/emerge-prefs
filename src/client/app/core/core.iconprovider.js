(function() {
  'use strict';

  angular
    .module('app')
    .config(function($mdIconProvider) {
      $mdIconProvider
        .defaultIconSet('/content/icons/sets/core-icons.svg', 24);
    })
})();