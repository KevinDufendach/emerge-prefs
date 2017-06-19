(function () {
  'use strict';

  angular
    .module('app.conditions')
    .factory('conditionFactory', conditionFactory);

  conditionFactory.$inject = ['$http', '$q', '$log'];

  /* @ngInject */
  function conditionFactory($http, $q, $log) {
    var self = this;

    self.data = [];
    self.categoryList = [];
    self.rawJson = {};

    var service = {
      data: self.data,
      categoryList: self.categoryList
      // conditions: self.conditions
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

              try {
                angular.forEach(response.data.data, function(conditionList, category) {
                  var condition;

                  if (self.categoryList.indexOf(category) === -1) {
                    self.categoryList.push(category);
                    self.data[category] = [];
                  }

                  for (var i = 0; i < conditionList.length; i++) {

                    condition = conditionList[i];
                    condition.id = condition.id.toLowerCase();

                    self.data[category].push(condition);
                  }

                });

                resolve(self.data);

              } catch (e) {
                $log.log(e);
                reject(e);
              }

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

