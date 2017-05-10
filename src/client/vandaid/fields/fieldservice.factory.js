(function () {
  'use strict';

  angular
    .module('va.fields')
    .factory('vandaidFieldService', fieldService);

  fieldService.$inject = ['$q', 'redcapService', 'vandaidUserService', '__va'];

  function fieldService($q, redcapService, vandaidUserService, __va) {
    var self = this;

    var states = {
      UNITIALIZED: 0,
      INITIALIZING: 1,
      READY: 2
    };

    var values = {};

    self.fields = [];
    self.state = states.UNITIALIZED;
    self.initializeResolveList = [];
    self.initializeRejectList = [];

    initialize();

    var service = {
      fields: self.fields,
      isReady: isReady,
      initialize: initialize,
      getFields: getFields,
      getValue: getValue,
      submit: submitFields,
      values: values
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
        redcapService.retrieveFieldsFromREDCap(__va.formName)
          .then(
            // On success
            function (data) {
              var curField, i;

              for (i = 0; i < data.length; i++) {
                curField = new redcapService.fieldConstructor(data[i]);
                self.fields.push(curField);
                values[curField.id] = redcapService.getInitialValue(curField);
              }

              self.state = states.READY;

              for (i = 0; i < self.initializeResolveList.length; i++) {
                self.initializeResolveList[i](self.fields);
              }
              self.initializeResolveList.length = 0;
              self.initializeRejectList.length = 0;

              resolve(self.fields);
            },
            // On failure
            function (response) {
              var i;
              for (i = 0; i < self.initializeRejectList.length; i++) {
                self.initializeRejectList[i](response);
              }
              self.initializeResolveList.length = 0;
              self.initializeRejectList.length = 0;

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
            initialize();
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

    /**
     * Returns the value of the specified field by name.
     *
     * @param fieldName required fieldName (id)
     * @param code optional code for checkboxes. Ignored for other data types.
     */
    function getValue(fieldName, code) {
      if (!fieldName || !values[fieldName]) return;

      if (angular.isDefined(values[fieldName][code])) {
        return values[fieldName][code];
      }

      return values[fieldName];
    }


    function submitFields() {
      return redcapService.submitData(values, vandaidUserService.getUser());
    }
  }

})();