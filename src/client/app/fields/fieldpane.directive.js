(function () {
  'use strict';

  angular
    .module('app.fields')
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
      templateUrl: '/app/fields/fieldpane.directive.html'
    };
    return directive;

    // function getTemplateUrl(elem, attrs) {
    //   console.log(attrs.type);
    //   return ('<p>this is my template</p>');
    // }
  }

  /* @ngInject */
  function FieldPaneController() {

  }

})();