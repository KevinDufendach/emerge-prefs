(function() {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidIdentityBar', IdentityBar);

  IdentityBar.$inject = ['userService'];

  function IdentityBar(userService) {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/navigation/identitybar.directive.html',
      controller: IdentityBarController,
      controllerAs: 'vm'
    };
    return directive;

    ///////////

    function IdentityBarController() {
      var vm = this;

      vm.isLoggedIn = userService.isLoggedIn();
    }
  }

})();