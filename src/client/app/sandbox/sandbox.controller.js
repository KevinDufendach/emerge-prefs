(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('Sandbox-Ctrl', SandboxCtrl);

  SandboxCtrl.$inject = ['redcapService', 'appTools'];

  function SandboxCtrl(redcapService, appTools) {
    var vm = this;

    vm.status = 'nothing to do';
    vm.guests = ['empty'];

    vm.status = 'retrieving from REDCap';
    redcapService.retrieveFieldsFromREDCap().then(
      function (data) {
        console.log('finished successful retrieval');
        vm.guests = appTools.arrayConstructor(data, redcapService.fieldConstructor);
        vm.status = 'Completed retrieval. Dormant';
      },
      function (response) {
        console.log(response);
      }
    );
  }

})();