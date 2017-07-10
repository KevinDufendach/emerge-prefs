(function () {
  'use strict';

  angular
    .module('va.nav')
    .controller('instructionTriggerCtrl', instructionTriggerCtrl);

  // instructionTrigger.$inject = [];
  //
  // /* @ngInject */
  // function instructionTrigger() {
  //   var directive = {
  //     bindToController: true,
  //     controller: instructionTriggerCtrl,
  //     controllerAs: 'ctrl',
  //     restrict: 'A',
  //     scope: {}
  //   };
  //   return directive;
  // }

  instructionTriggerCtrl.$inject = ['$mdDialog', '__va', '$log'];

  /* @ngInject */
  function instructionTriggerCtrl($mdDialog, __va, $log) {
    var ctrl = this;

    ctrl.showInstructions = function (ev) {
      $log.log('showInstructions button clicked');

      var instructionDialog = {
        controller: InstructionDialogCtrl,
        templateUrl: __va.instructionsTemplateHtml,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      };

      $mdDialog
        .show(instructionDialog)
        .then(function (answer) {
          $log.log('You said the information was "' + answer + '".');
        }, function () {
          $log.log('You cancelled the dialog.');
        });
    };

    InstructionDialogCtrl.$inject = ['$scope','$mdDialog'];

    function InstructionDialogCtrl($scope, $mdDialog) {
      var ctrl = this;

      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }

  }

})();

