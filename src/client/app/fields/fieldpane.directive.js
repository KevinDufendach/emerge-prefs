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
      scope: { field: '=' },
      template: '<p>My type is: {{vm.field.type}}</p>'
    };
    return directive;
  }

  /* @ngInject */
  function FieldPaneController() {
    var vm = this;

    vm.getWidgetType = function( fieldType ) {
      switch (fieldType) {
        case "radio":
        case "yesno":
        case "truefalse":
          return "fields/radio.html";
        case "checkbox":
          return "fields/checkbox.html";
        case "checklist":
          return "fields/checklist.html";
        case "text":
        case "notes":
        default:
          return "fields/text.html";
      }
    }
  }

})();