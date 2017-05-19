(function () {
  'use strict';

  angular
    .module('va.nav')
    .directive('vaTopBar', topBar);


  /* @ngInject */
  function topBar() {
    var directive = {
      bindToController: true,
      templateUrl: '/src/client/vandaid/navigation/topbar.directive.html',
      controller: topBarController,
      controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        expanded: '='
      }
    };
    return directive;
  }

  topBarController.$inject = ['vandaidUserService', '__va', 'vandaidFieldService'];

  /* @ngInject */
  function topBarController(vandaidUserService, __va, vandaidFieldService) {
    var vm = this;

    vm.toggleSidenav = toggleSidenav;
    vm.isLoggedIn = vandaidUserService.isLoggedIn();
    vm.getLogo = getLogo;
    vm.getBackground = getBackground;
    vm.submit = vandaidFieldService.submit;

    vm.title = __va.title || 'VandAID - Active Interface Design';

    //////////////

    function toggleSidenav(navID) {
      // $mdSidenav(navID).toggle();
    }

    function getLogo() {
      return __va.logo || '/src/client/vandaid/content/img/Vanderbilt-Logo-white500x500.png';
    }

    function getBackground() {
      return __va.logoBackground || 'rgb(153,127,61)';
    }
  }

})();

