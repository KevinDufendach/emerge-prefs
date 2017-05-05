(function () {
  'use strict';

  angular
    .module('app')
    .directive('vandaidTest', vandaidTest);

  vandaidTest.$inject = ['vandaidFieldService'];

  /* @ngInject */
  function vandaidTest(vandaidFieldService) {
    var directive = {
      bindToController: true,
      controller: VandaidTestCtrl,
      controllerAs: 'vm',
      templateUrl: '/app/vandaidTest.directive.html',
      restrict: 'AE',
      scope: {}
    };
    return directive;

  }

  VandaidTestCtrl.$inject = ['$scope', 'vandaidFieldService'];

  /* @ngInject */
  function VandaidTestCtrl($scope, vandaidFieldService) {
    var vm = this;
    vm.submit = submit;

    vandaidFieldService.getFields().then(
      function (fields) {
        $scope.fields = fields;
        $scope.va = vandaidFieldService.values;
      }
    );

    function submit() {
      vandaidFieldService.submit().then(
        // on resolve
        function (data) {
          $scope.submitReturn = data;
        },
        // on reject
        function (data) {
          $scope.submitReturn = 'Error: ' + data;
        }
      )
    }
  }

})();

