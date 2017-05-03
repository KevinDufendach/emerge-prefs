(function () {
  'use strict';

  angular
    .module('app.fields')
    .directive('vaSubmitButton', vaSubmitButton);

  vaSubmitButton.$inject = ['vandaidFieldService'];

  /* @ngInject */
  function vaSubmitButton(vandaidFieldService) {
    var directive = {
      bindToController: true,
      restrict: 'EA',
      templateUrl: '/app/fields/submitButton.directive.html',
      controller: submitButtonCtrl,
      controllerAs: 'vm'
    };
    return directive;

  }

  submitButtonCtrl.$inject = ['vandaidFieldService'];

  function submitButtonCtrl(vandaidFieldService) {
    this.submit = vandaidFieldService.submit;

  }

})();

