(function () {
  'use strict';

  angular
    .module('va.project')
    .directive('emergePrefs', emergePrefs);

  emergePrefs.$inject = [];

  /* @ngInject */
  function emergePrefs() {
    var directive = {
      bindToController: true,
      controller: EmergePrefsController,
      controllerAs: 'vm',
      templateUrl: '/projects/js/project.directive.html',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  EmergePrefsController.$inject = ['$http', '$q', 'vandaidFieldService', '$scope'];

  /* @ngInject */
  function EmergePrefsController($http, $q, vandaidFieldService, $scope) {
    var vm = this;

    vandaidFieldService.getFields().then(
      function (fields) {
        $scope.va = vandaidFieldService.values;
        vm.va = vandaidFieldService.values;
      }
    );

    var conditions = [];

    var ctrlApi = {
      getConditions: getConditions,
      getShownStatus: getShownStatus,
      getImageUrl: getImageUrl
    };

    initialize();

    return ctrlApi;

    ////////////

    function initialize() {
      retrieveConditionsFromUri('/projects/content/conditions.json');
    }

    function getConditions() {
      return conditions;
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
              conditions = response.data;

              resolve();
            },
            // On failure
            function (response) {
              reject(response);
            }
          );
      });
    }

    function getShownStatus(condition) {
      if (!vandaidFieldService.isReady()) {
        return true;
      }

      return (
        ((condition.preventable && vm.va.adol_preventable[1]) ||
          (!condition.preventable && vm.va.adol_preventable[2])) &&
        ((condition.treatable && vm.va.adol_treatable[1]) ||
          (!condition.treatable && vm.va.adol_treatable[2])) &&
        (!condition.adult_onset || vm.va.adol_adult_onset == "1")
      )
    }

    function getImageUrl(value) {
      var prefix = '/projects/content/img/';

      switch(value) {
        case 'ADRENAL':
          return prefix + 'kidneys.png';
        case 'VESSEL':
          return prefix + 'vessel.png';
        case 'JOINT':
          return prefix + 'joint.png';
        case 'CANCER':
          return prefix + 'cancer.png';
      }
    }

  }

})();

