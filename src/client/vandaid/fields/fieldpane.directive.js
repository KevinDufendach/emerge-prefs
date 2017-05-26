(function () {
  'use strict';

  angular
    .module('va.fields')
    .directive('vandaidFieldPane', vandaidFieldPane);

  /* @ngInject */
  function vandaidFieldPane() {
    var directive = {
      bindToController: true,
      controller: FieldPaneController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        field: '=',
        type: '@'
      },
      templateUrl: '/vandaid/fields/fieldpane.directive.html'
    };
    return directive;
  }

  /* @ngInject */
  function FieldPaneController() {

  }

})();