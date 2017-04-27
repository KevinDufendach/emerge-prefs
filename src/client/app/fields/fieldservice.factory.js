(function () {
  'use strict';

  angular
    .module('app.fields')
    .factory('vandaidFieldService', fieldService);

  fieldService.$inject = ['$q', 'redcapService', 'appTools'];

  function fieldService($q, redcapService, appTools) {
    var self = this;

    var states = {
      UNITIALIZED: 0,
      INITIALIZING: 1,
      READY: 2
    };

    self.fields = [];
    self.state = states.UNITIALIZED;
    self.initializeResolveList = [];
    self.initializeRejectList = [];
    self.myVar = 2.3;

    var service = {
      fields: self.fields,
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
      self.state = states.INITIALIZING;
      return $q(function (resolve, reject) {
        redcapService.retrieveFieldsFromREDCap()
          .then(
            // On success
            function (data) {
              console.log('FieldService successfully initialized');
              for (var i = 0; i < data.length; i++) {
                self.fields.push(new redcapService.fieldConstructor(data[i]));
              }

              // self.fields = appTools.arrayConstructor(data, redcapService.fieldConstructor);
              self.state = states.READY;
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
          if (self.state === states.READY) {
            resolve(self.fields);
            return;
          }

          self.initializeResolveList.push(resolve);
          self.initializeRejectList.push(reject);

          if (self.state === states.UNITIALIZED) {

            initialize().then(
              function () {
                var i;
                for (i = 0; i < self.initializeResolveList.length; i++) {
                  self.initializeResolveList[i](self.fields);
                }
              },
              function (response) {
                var i;
                for (i = 0; i < self.initializeResolveList.length; i++) {
                  self.initializeRejectList[i](response);
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
      return (self.state === states.READY);
    }

  }

})();