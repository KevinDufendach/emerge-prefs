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

  EmergePrefsController.$inject = ['vandaidFieldService', '$scope', 'conditionFactory', '$log'];

  /* @ngInject */
  function EmergePrefsController(vandaidFieldService, $scope, conditionFactory, $log) {
    var vm = this;

    vm.getConditions = getConditions;
    vm.getShownStatus = getShownStatus;
    vm.getImageUrl = getImageUrl;
    vm.$onInit = initialize;
    vm.cycleManual = cycleManual;

    ////////////

    function initialize() {
      vandaidFieldService.getFields().then(
        function () {
          $scope.va = vandaidFieldService.values;
          vm.va = vandaidFieldService.values;

          vm.va.adol_preventable[1] = true;
          vm.va.adol_treatable[1] = true;
        }
      );
    }

    function getConditions() {
      return conditionFactory.conditions;
    }

    function getShownStatus(condition) {
      if (!vandaidFieldService.isReady()) {
        return true;
      }

      return (
        !vm.va.manual_exclude[condition.id] && (vm.va.manual_include[condition.id] ||
        (((condition.preventable && vm.va.adol_preventable[1]) ||
        (!condition.preventable && vm.va.adol_preventable[2])) &&
        ((condition.treatable && vm.va.adol_treatable[1]) ||
        (!condition.treatable && vm.va.adol_treatable[2])) &&
        (!condition.adult_onset || vm.va.adol_adult_onset == "1")))
      )
    }

    function cycleManual(conditionId) {
      if (!conditionId) return;

      try {
        if (vm.va.manual_include[conditionId]) {
          vm.va.manual_include[conditionId] = false;
          vm.va.manual_exclude[conditionId] = true;
        } else if (vm.va.manual_exclude[conditionId]) {
          vm.va.manual_include[conditionId] = false;
          vm.va.manual_exclude[conditionId] = false;
        } else {
          vm.va.manual_include[conditionId] = true;
          vm.va.manual_exclude[conditionId] = false;
        }

        // if (value) {
        //   if (vm.va.manual_include[conditionId]) {
        //     vm.va.manual_exclude[conditionId] = false;
        //   }
        // } else {
        //   if (vm.va.manual_exclude[conditionId]) {
        //     vm.va.manual_include[conditionId] = false;
        //   }
        // }

      } catch(e) {
        $log.log('Error setting manual *clusion: ' + e);
      }
    }

    function getImageUrl(value) {
      var prefix = '/src/client/content/img/';

      switch (value) {
        case 'ADRENAL':
          return prefix + 'kidneys.png';
        case 'VESSEL':
          return prefix + 'vessel.png';
        case 'JOINT':
          return prefix + 'joint.png';
        case 'CANCER':
        default:
            return prefix + 'cancer.png';
      }
    }

  }

})();

