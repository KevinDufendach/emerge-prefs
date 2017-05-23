(function () {
  'use strict';

  angular
    .module('app')
    .directive('emergePrefs', emergePrefs);

  emergePrefs.$inject = [];

  /* @ngInject */
  function emergePrefs() {
    var directive = {
      bindToController: true,
      controller: EmergePrefsController,
      controllerAs: 'vm',
      templateUrl: '/src/client/app/project.directive.html',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  EmergePrefsController.$inject = ['vandaidFieldService', '$scope', 'conditionFactory'];

  /* @ngInject */
  function EmergePrefsController(vandaidFieldService, $scope, conditionFactory) {
    var vm = this;

    vandaidFieldService.getFields().then(
      function () {
        $scope.va = vandaidFieldService.values;
        vm.va = vandaidFieldService.values;
      }
    );

    var ctrlApi = {
      conditions: conditionFactory.conditions,
      getShownStatus: getShownStatus,
      getImageUrl: getImageUrl
    };

    return ctrlApi;

    ////////////

    function getShownStatus(condition) {
      if (!vandaidFieldService.isReady()) {
        return true;
      }

      return (
        (((condition.preventable && vm.va.adol_preventable[1]) ||
          (!condition.preventable && vm.va.adol_preventable[2])) &&
        ((condition.treatable && vm.va.adol_treatable[1]) ||
          (!condition.treatable && vm.va.adol_treatable[2])) &&
        (!condition.adult_onset || vm.va.adol_adult_onset == "1")) || condition.alwaysInclude
      )
    }

    function getImageUrl(value) {
      var prefix = '/src/client/content/img/';

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

