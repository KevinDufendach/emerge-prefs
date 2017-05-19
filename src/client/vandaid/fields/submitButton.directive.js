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
      template: '<md-button class="md-primary md-raised" aria-label="Save and Submit" ng-click="vm.submit()">Save and Submit</md-button>',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  submitButtonCtrl.$inject = ['vandaidFieldService'];

  function submitButtonCtrl(vandaidFieldService) {
    this.submit = vandaidFieldService.submit;
  }

})();
