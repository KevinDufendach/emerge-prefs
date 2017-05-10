(function() {
  'use strict';

  angular
    .module('va')
    .config(function($mdIconProvider) {
      $mdIconProvider
        .defaultIconSet('/src/client/content/icons/sets/core-icons.svg', 24);
    })
})();