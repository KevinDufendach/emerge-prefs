(function () {
  'use strict';

  angular
    .module('app.fields')
    .factory('fieldService', fieldService);

  fieldService.$inject = ['$q', 'redcapService', 'appTools'];

  function fieldService($q, redcapService, appTools) {
    var vm = this;

    vm.fields = [];
    vm.isReady = false;

    var service = {
      fields: vm.fields,
      isReady: vm.isReady,
      initialize: initialize,
      getFields: getFields
    };
    return service;

    //////////////////

    /**
     * Initializes the fieldservice, returning a promise which can be used to respond when the service is initialized
     * @returns {*} Promise callback tha allows functionality after the service is initialized. Reminder:
     *    Callback should be fieldService.initialize().then( function onSuccess() { // doSomething } );
     */
    function initialize() {
      return $q(function (resolve, reject) {
        redcapService.retrieveFieldsFromREDCap()
          .then(
            // On success
            function (data) {
              console.log('finished successful retrieval');
              vm.fields = appTools.arrayConstructor(data, redcapService.fieldConstructor);
              vm.isReady = true;
              resolve();
            },
            // On failure
            function (response) {
              console.log(response);
              reject(response);
            }
          );
      })
    }

    function getFields() {
      return vm.fields;
    }

  }

})();