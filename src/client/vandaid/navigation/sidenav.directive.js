(function () {
  'use strict';

  angular
    .module('va.nav')
    .directive('vaSidenav', vandaidSidenav);

  vandaidSidenav.$inject = [];

  /* @ngInject */
  function vandaidSidenav() {
    var directive = {
      // replace: true,
      bindToController: true,
      controller: SidenavController,
      controllerAs: 'vm',
      templateUrl: '/src/client/vandaid/navigation/sidenav.directive.html',
      restrict: 'EA',
      compile: compileFn
    };
    return directive;

    function compileFn(elem) {
      // wrap tag
      var contents = elem.html();
      elem.html('<sidenav-content><div>' + contents + '</div></sidenav-content>');
    }
  }

  SidenavController.$inject = ['$mdSidenav', 'vandaidFieldService', '$scope', '$mdMedia', '__va'];

  /* @ngInject */
  function SidenavController($mdSidenav, vandaidFieldService, $scope, $mdMedia, __va) {
    var vm = this;
    vm.fields = vandaidFieldService.fields;
    vm.toggleSidenav = toggleSidenav;
    vm.submit = submit;

    $scope.$mdMedia = $mdMedia;
    vm.$onInit = activate;

    vm.logo = __va.logo || '/src/client/vandaid/content/img/Vanderbilt-Logo-white500x500.png';

    //////////

    function activate() {
      vandaidFieldService.getFields()
        .then(
          function () {
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