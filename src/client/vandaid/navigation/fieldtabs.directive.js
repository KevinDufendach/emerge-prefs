(function () {
  'use strict';

  angular
    .module('va.nav')
    .directive('vaFieldTabs', vandaidFieldTabsDirective);

  vandaidFieldTabsDirective.$inject = [];

  /* @ngInject */
  function vandaidFieldTabsDirective() {
    var directive = {
      bindToController: true,
      controller: FieldTabsController,
      controllerAs: 'vm',
      templateUrl: '/src/client/vandaid/navigation/fieldtabs.directive.html',
      restrict: 'EA'
    };
    return directive;
  }

  FieldTabsController.$inject = ['vandaidFieldService', '$scope', '$mdMedia'];

  /* @ngInject */
  function FieldTabsController(vandaidFieldService, $scope, $mdMedia) {
    var vm = this;
    vm.fields = [];
    // vm.fs = vandaidFieldService;
    vm.submit = submit;
    vm.next = next;
    vm.previous = previous;
    vm.selectedIndex = 0;
    vm.ready = false;

    vm.$onInit = activate;

    //////////

    function activate() {


      vandaidFieldService.getFields()
        .then(
          function (fields) {
            vm.fields = fields;
            vm.ready = true;
          }
        )
    }


    function next() {
      console.log(vm.selectedIndex);
      vm.selectedIndex = Math.min(vm.selectedIndex + 1, vm.fields.length) ;
    }

    function previous() {
      vm.selectedIndex = Math.max(vm.selectedIndex - 1, 0);
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