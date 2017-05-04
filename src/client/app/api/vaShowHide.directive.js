(function () {
  'use strict';

  var NG_HIDE_CLASS = 'ng-hide';
  var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

  angular
    .module('app.api')
    .directive('vaShow', vaShowDirective)
    .directive('vaHide', vaHideDirective);

  vaShowDirective.$inject = ['$animate'];

  /* @ngInject */
  function vaShowDirective($animate) {
    var directive = {
      restrict: 'A',
      multiElement: true,
      link: linkFn
    };
    return directive;

    function linkFn(scope, element, attr) {
      scope.$watch(attr.vaShow, ngShowWatchAction);

      function ngShowWatchAction(value) {
        // we're adding a temporary, animation-specific class for ng-hide since this way
        // we can control when the element is actually displayed on screen without having
        // to have a global/greedy CSS selector that breaks when other animations are run.
        // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
        $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      }
    }
  }

  vaHideDirective.$inject = ['$animate'];

  /* @ngInject */
  function vaHideDirective($animate) {
    var directive = {
      restrict: 'A',
      multiElement: true,
      link: linkFn
    };
    return directive;

    function linkFn(scope, element, attr) {
      scope.$watch(attr.vaHide, ngHideWatchAction);

      function ngHideWatchAction(value) {
        // we're adding a temporary, animation-specific class for ng-hide since this way
        // we can control when the element is actually displayed on screen without having
        // to have a global/greedy CSS selector that breaks when other animations are run.
        // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
        $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      }
    }
  }

})();