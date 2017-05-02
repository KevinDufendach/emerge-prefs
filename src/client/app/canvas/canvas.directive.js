(function () {
  'use strict';

  angular
    .module('app.canvas')
    .directive('vandaidCanvas', vandaidCanvas);

  vandaidCanvas.$inject = [];

  /* @ngInject */
  function vandaidCanvas() {
    var directive = {
      bindToController: true,
      controller: CanvasCtrl,
      controllerAs: 'vm',
      // transclude: true,
      templateUrl: '/projects/vandaid_test/test.html',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  CanvasCtrl.$inject = ['$scope', 'vandaidFieldService'];

  /* @ngInject */
  function CanvasCtrl($scope, vandaidFieldService) {
    $scope.fieldService = vandaidFieldService;
  }

})();

