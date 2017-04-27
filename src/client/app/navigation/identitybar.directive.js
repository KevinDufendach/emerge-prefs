(function() {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidIdentityBar', IdentityBar);

  function IdentityBar() {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/navigation/identitybar.directive.html',
      controller: IdentityBarController,
      controllerAs: 'vm'
    };
    return directive;

    ///////////

    function IdentityBarController() {

    }
  }

})();