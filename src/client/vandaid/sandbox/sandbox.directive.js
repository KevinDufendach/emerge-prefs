(function () {
  'use strict';

  angular
    .module('va.sandbox')
    .directive('vandaidSandbox', vandaidSandbox);

  vandaidSandbox.$inject = [];

  /* @ngInject */
  function vandaidSandbox() {
    var directive = {
      bindToController: true,
      controller: SandboxCtrl,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: '/vandaid/sandbox/sandbox.directive.html'
    };
    return directive;
  }

  SandboxCtrl.$inject = ['vandaidFieldService'];

  /* @ngInject */
  function SandboxCtrl(vandaidFieldService) {
    var vm = this;

    vm.status = 'nothing to do';
    vm.guests = ['empty'];

    vm.status = 'retrieving from REDCap';
    vandaidFieldService.getFields()
      .then(
        function (fields) {
          console.log('fieldService initialized');
          vm.guests = fields;
        }
      );

    // redcapService.retrieveFieldsFromREDCap().then(
    //   function (data) {
    //     console.log('finished successful retrieval');
    //     vm.guests = vaTools.arrayConstructor(data, redcapService.fieldConstructor);
    //     vm.status = 'Completed retrieval. Dormant';
    //   },
    //   function (response) {
    //     console.log(response);
    //   }
    // );
  }

})();

