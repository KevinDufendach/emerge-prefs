(function() {
  'use strict';

  angular
    .module('va')
    .controller('vaCtrl', mainCtrl);

  mainCtrl.$inject = ['$scope', '$log'];

  function mainCtrl($scope, $log) {
    $scope.sidebarExpanded = true;

    $log.log($scope.sidebarExpanded);
  }


})();