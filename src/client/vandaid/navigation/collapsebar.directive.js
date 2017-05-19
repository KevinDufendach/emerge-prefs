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
      bindToController: true,
      compile: compileFn,
      controller: collapseBarController,
      controllerAs: 'vm',
      templateUrl: '/src/client/vandaid/navigation/collapsebar.directive.html',
      restrict: 'EA',
      scope: {
        expanded: '=',
        expandDirection: '@'
      }
    };
    return directive;

    function compileFn(elem, attrs) {
      if (!attrs.expandDirection) {
        attrs.expandDirection = 'left';
      }
      if (!attrs.expanded) {
        attrs.expanded = true;
      }
    }
  }

  /* @ngInject */
  function collapseBarController() {
    var vm = this;
    var leftDirection = true;
    vm.$onInit = onInit;
    vm.toggle = toggle;
    vm.shouldRotate180 = shouldRotate180;

    //////////

    function onInit() {
      if (vm.expandDirection === 'right') {
        leftDirection = false;
      }
    }

    function toggle() {
      vm.expanded = !vm.expanded;
    }

    function shouldRotate180() {
      return (leftDirection && !vm.expanded) || (!leftDirection && vm.expanded);
    }
  }

})();

