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

  submitButtonCtrl.$inject = ['vandaidFieldService', '__va', '$mdToast', '$log'];

  function submitButtonCtrl(vandaidFieldService, __va, $mdToast, $log) {
    var vm = this;

    vm.submit = function () {
      vandaidFieldService.submit().then(
        // on success
        function () {
          var toast = $mdToast.simple()
            .textContent(__va.submit_button_text || 'Successfully saved to REDCap')
            .position('top right')
            .hideDelay(3000);

          $mdToast.show(toast);

        },
        // on error
        function (e) {
          $log.log('Submission not successful: ' + e);
          $mdToast.showSimple('Unable to submit: ' + e);
        }
      )
    };

    vm.getButtonClass = function () {
      return (__va.submit_button_class || 'md-accent');
    }

  }

})();
