(function () {
  'use strict';

  angular
    .module('va.fields')
    .factory('vandaidFieldService', fieldService);

  fieldService.$inject = ['$q', 'redcapService', 'vandaidUserService', '__va', '$log'];

  function fieldService($q, redcapService, vandaidUserService, __va, $log) {
    var self = this;

    var states = {
      UNITIALIZED: 0,
      INITIALIZING: 1,
      LOADING_DEFAULTS: 2,
      READY: 3
    };

    var pendingTasks = 0;

    self.values = {};

    self.fields = [];
    self.state = states.UNITIALIZED;
    self.initializeResolveList = [];
    self.initializeRejectList = [];

    // initializeFields();
    // loadDefaults();

    var service = {
      fields: self.fields,
      isReady: isReady,
      initialize: initialize,
      getFields: getFields,
      getValue: getValue,
      submit: submitFields,
      values: self.values
    };

    initialize();
    return service;

    //////////////////

    /**
     * Initializes the fieldservice, returning a promise which can be used to respond when the service is initialized
     * @returns {*} Promise callback that allows functionality after the service is initialized. Reminder:
     *    Callback should be fieldService.initialize().then( function onSuccess() { // doSomething } );
     */
    function initialize() {
      self.sate = states.INITIALIZING;

      return $q.all(
        [
          initializeFields(),
          vandaidUserService.verifyUser()
            .then(loadDefaults())
        ]
      ).then(
        // on success
        function () {
          redcapService.updateToVandAIDStyleFieldValues(self.values, self.fields);

          for (var i = 0; i < self.initializeResolveList.length; i++) {
            self.initializeResolveList[i](self.fields, self.values);
          }

          self.initializeResolveList.length = 0;
          self.initializeRejectList.length = 0;
        },

        // on failure
        function (e) {
          for (var i = 0; i < self.initializeRejectList.length; i++) {
            self.initializeRejectList[i](response);
          }
          self.initializeResolveList.length = 0;
          self.initializeRejectList.length = 0;

          $log.log('Error initializing field service: ' + e)
        }
      )
    }

    function initializeFields() {
      return $q(function (resolve, reject) {
        redcapService.retrieveFieldsFromREDCap(__va.formName)
          .then(
            // On success
            function (data) {
              var curField, i;

              for (i = 0; i < data.length; i++) {
                curField = new redcapService.fieldConstructor(data[i]);
                self.fields.push(curField);

                // use REDCap service to add field value to the values object. Don't overwrite
                redcapService.addFieldValue(curField, self.values, false);
              }

              resolve(self.fields);
            },
            // On failure
            function (e) {
              reject(e);
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
            initializeFields();
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
      if (!fieldName || !self.values[fieldName]) return;

      if (angular.isDefined(self.values[fieldName + '___' + code])) {
        return self.values[fieldName + '___' + code];
      }

      return self.values[fieldName];
    }

    /**
     * Submits fields to REDCap project. Uses UserService to get current user.
     *
     * @return {*} Returns promise from the redcap service
     */
    function submitFields() {
      return redcapService.submitData(vandaidUserService.getUser(), self.values);
    }

    function loadDefaults() {
      if (!vandaidUserService.isLoggedIn()) {
        loadData(vandaidUserService.getUser()).then(
          // Nothing to do with resolve
          angular.noop
          ,
          // If reject, try 'default' user settings
          loadData(new vandaidUserService.userConstructor({id: 'default', key: ''}))
        )
      }
    }

    function loadData(user) {
      return $q(function (resolve, reject) {

        redcapService.loadData(user, __va.formName || 'my_first_instrumcnt').then(
          // on successful load:
          function (data) {
            $log.log('Data successfully loaded');

            angular.forEach(data,
              function (val, key) {
                self.values[key] = val;
              });
            resolve(self.values);
          },
          function (e) {
            $log.log('unable to load data: ' + e);

            reject('unable to load data: ' + e);
          }
        );

      })

    }
  }

})();