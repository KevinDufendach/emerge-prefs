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
      templateUrl: '/vandaid/navigation/fieldtabs.directive.html',
      restrict: 'EA'
    };
    return directive;
  }

  FieldTabsController.$inject = ['vandaidFieldService', '$scope', '$log'];

  /* @ngInject */
  function FieldTabsController(vandaidFieldService, $scope, $log) {
    var vm = this;
    vm.fields = [];
    vm.submit = submit;
//     vm.next = next;
//     vm.previous = previous;
    vm.incrementIndex = incrementIndex;
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

    /**
     * Increments the tab index according to the direction. Default is +1
     *
     * @param direction
     */
    function incrementIndex(direction) {
      // default is +1
      if (!angular.isDefined(direction)) {
        direction = +1;
      }

      // return if 0 supplied for direction
      if (direction === 0) return;

      var priorIndex = vm.selectedIndex;
      $log.log('Start selectedIndex: ' + priorIndex);
      do {
        // vm.selectedIndex = Math.min(vm.selectedIndex + 1, vm.fields.length);
        vm.selectedIndex = vm.selectedIndex + direction;
        $log.log('Checking: ' + vm.selectedIndex);

      }
      while (vm.selectedIndex >= 0 && vm.selectedIndex < vm.fields.length && vm.fields[vm.selectedIndex].branching_logic !== '');

      if (vm.selectedIndex < 0 || vm.selectedIndex >= vm.fields.length) {
        vm.selectedIndex = priorIndex;
      }
      $log.log('New selectedIndex: ' + vm.selectedIndex);
    }

    function previous() {
      vm.selectedIndex = Math.max(vm.selectedIndex - 1, 0);
      $log.log(vm.selectedIndex);
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