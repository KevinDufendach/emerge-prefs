(function () {
  'use strict';

  angular
    .module('app.canvas')
    .directive('vandaidPaper', vandaidPaper);

  /* @ngInject */
  function vandaidPaper() {
    var directive = {
      transclude: true,
      restrict: 'E',
      templateUrl: '/app/canvas/paper.directive.html',
      scope: false
    };
    return directive;
  }

})();

