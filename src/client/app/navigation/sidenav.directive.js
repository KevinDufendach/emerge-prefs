(function () {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidSidenav', vandaidSidenav);

  vandaidSidenav.$inject = ['$mdSidenav', 'vandaidFieldService'];

  /* @ngInject */
  function vandaidSidenav() {
    var directive = {
      replace: true,
      bindToController: true,
      controller: SidenavController,
      controllerAs: 'vm',
      templateUrl: '/app/navigation/sidenav.directive.html',
      restrict: 'E'
    };
    return directive;
  }

  SidenavController.$inject = ['$mdSidenav', 'vandaidFieldService', '$vaShared', '$scope'];

  /* @ngInject */
  function SidenavController($mdSidenav, vandaidFieldService, $vaShared, $scope) {
    var vm = this;
    vm.fields = [];

    vm.fs = vandaidFieldService;

    vm.toggleSidenav = toggleSidenav;

    $scope.$vaShared = $vaShared;

    activate();

    //////////

    function toggleSidenav(navID) {
      $mdSidenav(navID).toggle();
    }

    function activate() {
      vandaidFieldService.getFields()
        .then(
          function(fields) {
            vm.fields = fields;
          }
        )
    }
  }

})();