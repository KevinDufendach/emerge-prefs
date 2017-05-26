(function() {
  'use strict';

  angular
    .module('va')
    .config(function($mdIconProvider) {
      $mdIconProvider
        .defaultIconSet('/content/icons/sets/core-icons.svg', 24);
    })
})();