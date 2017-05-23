(function() {
  'use strict';

  angular
    .module('va')
    .controller('vaCtrl', mainCtrl);

  mainCtrl.$inject = ['$scope', '$vaThemingService', '$log'];

  function mainCtrl($scope, $vaThemingService, $log) {
    $scope.sidebarExpanded = true;
    $scope.$vaThemingService = $vaThemingService;
  }

})();