// (function () {
//   'use strict';
//
//   angular
//     .module('app.nav')
//     .directive('vandaidCollapseBar', vandaidCollapseBar);
//
//   vandaidCollapseBar.$inject = ['$vaShared'];
//
//   /* @ngInject */
//   function vandaidCollapseBar($vaShared) {
//     var directive = {
//       replace: true,
//       bindToController: true,
//       controller: collapseBarController,
//       controllerAs: 'vm',
//       templateUrl: 'app/navigation/collapsebar.directive.html',
//       restrict: 'E',
//       scope: { collapsed: '='}
//     };
//     return directive;
//   }
//
//   collapseBarController.$inject = ['$scope','$vaShared'];
//
//   /* @ngInject */
//   function collapseBarController($scope, $vaShared) {
//     var vm = this;
//
//     $scope.$vaShared = $vaShared;
//
//     if (!angular.isDefined($vaShared.sideBoxCollapsed)) {
//       $vaShared.sideBoxCollapsed = vm.collapsed;
//     }
//
//     vm.toggle = function() {
//       $vaShared.sideBoxCollapsed = !$vaShared.sideBoxCollapsed;
//     }
//   }
//
// })();

(function () {
  'use strict';

  angular
    .module('va.nav')
    .directive('vaCollapseBar', vandaidCollapseBar);

  /* @ngInject */
  function vandaidCollapseBar() {
    var directive = {
      // replace: true,
      // require: 'ngModel',
      // link: linkFn,
      bindToController: true,
      // compile: compileFn,
      controller: collapseBarController,
      controllerAs: 'vm',
      templateUrl: '/src/client/vandaid/navigation/collapsebar.directive.html',
      restrict: 'EA',
      scope: {
        collapsed: '=',
        collapseDirection: '@'
      }
    };
    return directive;

    function compileFn(elem, attrs) {
      if (!attrs.collapseDirection) {
        attrs.collapseDirection = 'left';
      }
    }

    //   function linkFn(scope, element, attrs, ngModel) {
    //     if (!ngModel) return;
    //
    //     element.on("click", function() {
    //       ngModel.$setViewValue(!ngModel.$viewValue);
    //       scope.$apply();
    //     })
    //
    //     // I think the 'ngModel' is ctrl[0], then the project controller is ctrl[1], etc. based on github code for angular
    //
    //   }
  }

  collapseBarController.$inject = ['$vaShared'];

  /* @ngInject */
  function collapseBarController($vaShared) {
    var vm = this;
    var leftDirection = true;
    vm.$onInit = onInit;
    vm.toggle = toggle;
    vm.shouldRotate180 = shouldRotate180;

    //////////

    function onInit() {
      if (vm.collapseDirection === 'right') {
        leftDirection = false;
      }

      if (!angular.isDefined($vaShared.sideBoxCollapsed)) {
        $vaShared.sideBoxCollapsed = vm.collapsed;
      }
    }

    function toggle() {
      $vaShared.sideBoxCollapsed = !$vaShared.sideBoxCollapsed;
      vm.collapsed = $vaShared.sideBoxCollapsed;
    }

    function shouldRotate180() {
      return (leftDirection && $vaShared.sideBoxCollapsed) || (!leftDirection && !$vaShared.sideBoxCollapsed);
    }
  }

})();

