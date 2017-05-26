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
      templateUrl: '/vandaid/navigation/sidenav.directive.html',
      restrict: 'EA',
      compile: compileFn
    };
    return directive;

    function compileFn(elem) {
      // wrap tag
      // var contents = elem.html();
      // elem.html('<sidenav-content><div>' + contents + '</div></sidenav-content>');
    }
  }

  SidenavController.$inject = ['$mdSidenav', 'vandaidFieldService', '$scope', '$mdMedia', '__va', '$log'];

  /* @ngInject */
  function SidenavController($mdSidenav, vandaidFieldService, $scope, $mdMedia, __va, $log) {
    var vm = this;
    vm.fields = vandaidFieldService.fields;
    vm.toggleSidenav = toggleSidenav;
    vm.submit = submit;
    var state = false;
    vm.isReady = isReady;

    $scope.$mdMedia = $mdMedia;
    vm.$onInit = activate;

    vm.logo = __va.logo || '/vandaid/content/img/Vanderbilt-Logo-white500x500.png';

    //////////

    function activate() {
      vandaidFieldService.getFields()
        .then(
          function () {
            state = true;
          }
        )
    }

    function toggleSidenav(navID) {
      $mdSidenav(navID).toggle();
    }

    function isReady() {
      $log.log('SideNav status: ' + state);
      return state;
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