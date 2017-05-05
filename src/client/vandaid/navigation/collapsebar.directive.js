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
    .directive('vandaidCollapseBar', vandaidCollapseBar);

  vandaidCollapseBar.$inject = ['$vaShared'];

  /* @ngInject */
  function vandaidCollapseBar($vaShared) {
    var directive = {
      replace: true,
      // require: 'ngModel',
      // link: linkFn,
      bindToController: true,
      controller: collapseBarController,
      controllerAs: 'vm',
      templateUrl: '/vandaid/navigation/collapsebar.directive.html',
      restrict: 'E',
      scope: {collapsed: '='}
    };
    return directive;

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

  collapseBarController.$inject = ['$scope', '$vaShared'];

  /* @ngInject */
  function collapseBarController($scope, $vaShared) {
    var vm = this;

    $scope.$vaShared = $vaShared;

    if (!angular.isDefined($vaShared.sideBoxCollapsed)) {
      $vaShared.sideBoxCollapsed = vm.collapsed;
    }

    vm.toggle = function () {
      $vaShared.sideBoxCollapsed = !$vaShared.sideBoxCollapsed;
    }
  }

})();

