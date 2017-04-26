(function () {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('Sandbox-Ctrl', SandboxCtrl);

  SandboxCtrl.$inject = ['redcapService', 'appTools', 'fieldService'];

  function SandboxCtrl(redcapService, appTools, fieldService) {
    var vm = this;

    vm.status = 'nothing to do';
    vm.guests = ['empty'];

    vm.status = 'retrieving from REDCap';
    fieldService.initialize()
      .then(
        function () {
          console.log('fieldService initialized');
          vm.guests = fieldService.getFields();
        }
      )

    // redcapService.retrieveFieldsFromREDCap().then(
    //   function (data) {
    //     console.log('finished successful retrieval');
    //     vm.guests = appTools.arrayConstructor(data, redcapService.fieldConstructor);
    //     vm.status = 'Completed retrieval. Dormant';
    //   },
    //   function (response) {
    //     console.log(response);
    //   }
    // );
  }

})();