(function () {
  'use strict';

  angular
    .module('va.fields')
    .directive('vaSubmitButton', vaSubmitButton);

  /* @ngInject */
  function vaSubmitButton() {
    var directive = {
      bindToController: true,
      controller: submitButtonCtrl,
      controllerAs: 'vm',
      template: '<md-button class="md-raised" ng-class="vm.getButtonClass()" aria-label="Save and Submit" ng-click="vm.submit()">Save and Submit</md-button>',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  submitButtonCtrl.$inject = ['vandaidFieldService', '__va'];

  function submitButtonCtrl(vandaidFieldService, __va) {
    var vm = this;

    vm.submit = vandaidFieldService.submit;
    vm.getButtonClass = function() {
      return (__va.submit_button_class || 'md-accent');
    }

  }

})();
