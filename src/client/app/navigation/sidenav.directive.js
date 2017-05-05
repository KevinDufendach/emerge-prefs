(function () {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidSidenav', vandaidSidenav);

  vandaidSidenav.$inject = [];

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

  SidenavController.$inject = ['$mdSidenav', 'vandaidFieldService', '$vaShared', '$scope', '$mdMedia'];

  /* @ngInject */
  function SidenavController($mdSidenav, vandaidFieldService, $vaShared, $scope, $mdMedia) {
    var vm = this;
    vm.fields = [];
    vm.fs = vandaidFieldService;
    vm.toggleSidenav = toggleSidenav;
    vm.submit = submit;

    $scope.$vaShared = $vaShared;
    vm.$mdMedia = $mdMedia;

    activate();

    //////////

    function activate() {
      vandaidFieldService.getFields()
        .then(
          function (fields) {
            vm.fields = fields;
          }
        )
    }

    function toggleSidenav(navID) {
      $mdSidenav(navID).toggle();
    }

    function submit() {
      vandaidFieldService.submit().then(
        // on resolve
        function (data) {
          $scope.submitReturn = data;
        },
        // on reject
        function (data) {
          $scope.submitReturn = 'There was an error: ' + data;
        }
      )
    }
  }

})();