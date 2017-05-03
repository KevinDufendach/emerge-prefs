(function () {
  'use strict';

  angular
    .module('app.canvas')
    .directive('vandaidCanvas', vandaidCanvas);

  vandaidCanvas.$inject = ['__env'];

  /* @ngInject */
  function vandaidCanvas(__env) {
    var directive = {
      bindToController: true,
      controller: CanvasCtrl,
      controllerAs: 'vm',
      // transclude: true,
      templateUrl: __env.canvasUri,
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  CanvasCtrl.$inject = ['$scope', 'vandaidFieldService'];

  /* @ngInject */
  function CanvasCtrl($scope, vandaidFieldService) {
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
          $scope.submitReturn = 'There was an error:\n' + data;
        }
      )
    }
  }

})();

