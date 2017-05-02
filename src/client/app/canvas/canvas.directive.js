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
    $scope.fieldService = vandaidFieldService;

    // $scope.va = vandaidFieldService.getValue;
    $scope.va = vandaidFieldService.values;
  }

})();

