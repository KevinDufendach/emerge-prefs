(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('Sandbox-Ctrl', SandboxCtrl);

  SandboxCtrl.$inject = ['$http', '$q'];

  function SandboxCtrl($http, $q) {
    var vm = this;

    vm.status = 'nothing to do';
    vm.guests = ['empty'];

    var deferred = $q.defer();
    $http.get('rest/redcap')
      .then(
        // On success
        function (data) {
          vm.guests = data;
          deferred.resolve();
          vm.status = 'dormant'
        }
      );
    // return deferred.promise;

  }

})();