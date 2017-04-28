(function () {
  'use strict';

  angular
    .module('app.canvas')
    .directive('vandaidCanvas', vandaidCanvas);

  vandaidCanvas.$inject = ['vandaidFieldService'];

  /* @ngInject */
  function vandaidCanvas(vandaidFieldService) {
    var directive = {
      bindToController: true,
      controller: CanvasCtrl,
      controllerAs: 'vm',
      transclude: true,
      template: '<div ng-transclude></div>',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  CanvasCtrl.$inject = ['$scope','vandaidFieldService'];

  /* @ngInject */
  function CanvasCtrl($scope, vandaidFieldService) {
    $scope.fieldService = vandaidFieldService;
  }

})();

