(function () {
  'use strict';

  angular
    .module('va.canvas')
    .directive('vaCanvas', vandaidCanvas);

  vandaidCanvas.$inject = [];

  /* @ngInject */
  function vandaidCanvas() {
    var directive = {
      controllerAs: 'vm',
      template: '<ng-transclude></ng-transclude>',
      transclude: true,
      restrict: 'EA'
    };
    return directive;
  }

  // Could consider adding the VandaidFieldService to the scope of the immediate child of the Canvas

})();

