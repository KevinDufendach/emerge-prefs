/**
 * Created by REIR8P on 4/28/2017.
 */
(function () {
  'use strict';

  angular
    .module('va.fields')
    .directive('vandaidFieldInputBox', FieldInputBox);

  FieldInputBox.$inject = ['$compile'];

  /* @ngInject */
  function FieldInputBox($compile) {
    var directive = {
      bindToController: true,
      controller: FieldInputBoxCtrl,
      controllerAs: 'vm',
      link: postLink,
      restrict: 'E',
      scope: {
        field: '='
      }
    };
    return directive;

    function postLink(scope, element, attrs, controller) {
      var template = getTemplate(controller.field.type);

      element.append($compile(template)(scope));
    }

    function getTemplate(type) {
      // return '<div>Test</div>';
      switch (type) {
        case 'text':
          return '<md-input-container flex>' +
            '<label>Comments</label>' +
            '<textarea ng-model="vm.va[vm.field.id]" md-select-on-focus></textarea>' +
            '</md-input-container>';
        case 'radio':
          return '<md-radio-group ng-model="vm.va[vm.field.id]" ng-switch="fieldAlign">' +
            '<div ng-switch-default>' +
            '<md-radio-button ng-repeat="option in vm.field.options"' +
            'ng-value="option.value">{{option.label}}' +
            '</md-radio-button>' +
            '</div>' +
            '<div ng-switch-when="horizontal">' +
            '<table class="horizontal-field-table">' +
            '<tbody>' +
            '<tr>' +
            '<td width="20%" ng-repeat="option in vm.field.options" align="center" layout-padding>{{option.label}}</td>' +
            '</tr>' +
            '<tr>' +
            '<td ng-repeat="option in vm.field.options" align="center" layout-padding>' +
            '<div layout="row">' +
            '<span flex></span>' +
            '<md-radio-button ng-value="option.value" align="center"' +
            'aria-label="{{option.value}}"></md-radio-button>' +
            '<span flex></span>' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</md-radio-group>';
        case 'yesno':
          return '<md-radio-group ng-model="vm.va[vm.field.id]">' +
            '<md-radio-button ng-repeat="option in vm.field.options" ng-value="option.value">{{option.label}}' +
            '</md-radio-button>' +
            '</md-radio-group>';
        case 'truefalse':
          return '<md-radio-group ng-model="vm.va[vm.field.id]">' +
            '<md-radio-button ng-repeat="option in vm.field.options" ng-value="option.value">{{option.label}}' +
            '</md-radio-button>' +
            '</md-radio-group>';
        case 'checkbox':
          return '<div><div ng-repeat="option in vm.field.options" class="checkbox">' +
            '<md-checkbox ng-model="vm.va[vm.field.id + \'___\' + option.value]">{{ option.label }}</md-checkbox>' +
            '</div></div>';
        default:
          return '<div layout="row" layout-sm="column" layout-align="space-around">' +
            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
            '</div>';
      }
    }
  }

  FieldInputBoxCtrl.$inject = ['vandaidFieldService'];

  /* @ngInject */
  function FieldInputBoxCtrl(vandaidFieldService) {
    // $scope.va = vandaidFieldService.values;
    this.va = vandaidFieldService.values;
  }

})();

