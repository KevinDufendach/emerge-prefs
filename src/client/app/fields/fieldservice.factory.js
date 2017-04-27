(function () {
  'use strict';

  angular
    .module('app.fields')
    .factory('vandaidFieldService', fieldService);

  fieldService.$inject = ['$q', 'redcapService', 'appTools'];

  function fieldService($q, redcapService, appTools) {
    var states = {
      UNITIALIZED: 0,
      INITIALIZING: 1,
      READY: 2
    };
    var fields = [];
    var state = states.UNITIALIZED;
    var initializeResolveList = [];
    var initializeRejectList = [];

    var service = {
      fields: fields,
      isReady: isReady,
      initialize: initialize,
      getFields: getFields
    };
    return service;

    //////////////////

    /**
     * Initializes the fieldservice, returning a promise which can be used to respond when the service is initialized
     * @returns {*} Promise callback that allows functionality after the service is initialized. Reminder:
     *    Callback should be fieldService.initialize().then( function onSuccess() { // doSomething } );
     */
    function initialize() {
      state = states.INITIALIZING;
      return $q(function (resolve, reject) {
        redcapService.retrieveFieldsFromREDCap()
          .then(
            // On success
            function (data) {
              console.log('FieldService successfully initialized');
              fields = appTools.arrayConstructor(data, redcapService.fieldConstructor);
              state = states.READY;
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

    /**
     * Returns fields in the form of a promise. Will initialize service as necessary.
     *
     * @returns {*} Promise callback that returns
     */
    function getFields() {
      return $q(function (resolve, reject) {
          if (state === states.READY) {
            resolve(fields);
            return;
          }

          initializeResolveList.push(resolve);
          initializeRejectList.push(reject);

          if (state === states.UNITIALIZED) {

            initialize().then(
              function () {
                var i;
                for (i = 0; i < initializeResolveList.length; i++) {
                  initializeResolveList[i](fields);
                }
              },
              function (response) {
                var i;
                for (i = 0; i < initializeResolveList.length; i++) {
                  initializeRejectList[i](response);
                }
              }
            );
          }
        }
      )
    }

    /**
     * Returns true if state === ready
     *
     * @returns {boolean}
     */
    function isReady() {
      return (state === states.READY);
    }

  }

})();