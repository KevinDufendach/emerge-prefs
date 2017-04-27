(function() {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidIdentityBar', IdentityBar);

  IdentityBar.$inject = ['userService', '$mdSidenav'];

  function IdentityBar(userService, $mdSidenav) {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/navigation/identitybar.directive.html',
      scope: { },
      controller: IdentityBarController,
      controllerAs: 'vm'
    };
    return directive;

    ///////////

    function IdentityBarController() {
      var vm = this;

      vm.toggleSidenav = toggleSidenav;
      vm.isLoggedIn = userService.isLoggedIn();

      //////////////

      function toggleSidenav(navID) {
        $mdSidenav(navID).toggle();
      }
    }
  }

})();