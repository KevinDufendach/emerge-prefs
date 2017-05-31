(function () {
  'use strict';

  angular
    .module('app.conditions')
    .factory('conditionFactory', conditionFactory);

  conditionFactory.$inject = ['$http', '$q', '$log'];

  /* @ngInject */
  function conditionFactory($http, $q, $log) {
    var self = this;

    self.conditions = [];

    var service = {
      conditions: self.conditions
    };
    initialize();

    return service;

    ////////////////

    function initialize() {
      retrieveConditionsFromUri('/content/csv_export.json');
    }

    /**
     * Function to retrieve conditions from a URI (could be a rest API, e.g. python script). Convenience function of
     * retrieveFieldsFromREDCap provided
     *
     * @returns $q promise function with data as an array of fields. Use 'then' logic.
     *
     * e.g.
     *   var rcFields;
     *   retrieveFieldsFromUri('myREDCapMetadataExportFile').then(
     *     // on success
     *     function (data) {
     *       rcFields = data;
     *       initialize();
     *     },
     *     // on failure
     *     function (response) {
     *       console.log(response);
     *     }
     *   )
     */
    function retrieveConditionsFromUri(uri) {
      return $q(function (resolve, reject) {
        $http.get(uri)
          .then(
            // On success
            function (response) {
              // ToDo: reject if error retrieving data or not formatted correctly
              
              var condition;

              try {
                for (var i = 0; i < response.data.data.length; i++) {
                  condition = response.data.data[i];
                  condition.id = condition.id.toLowerCase();

                  self.conditions.push(condition);
                }

              } catch (e) {
                $log.log(e);
              }

              resolve(self.conditions);
            },
            // On failure
            function (response) {
              $log.log('Unable to fetch data: ' + e);
              reject(response);
            }
          );
      });
    }
  }

})();

