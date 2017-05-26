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
      templateUrl: '/app/project.directive.html',
      restrict: 'EA',
      scope: {}
    };
    return directive;
  }

  EmergePrefsController.$inject = ['vandaidFieldService', '$scope', 'conditionFactory', '$log', '$mdMedia'];

  /* @ngInject */
  function EmergePrefsController(vandaidFieldService, $scope, conditionFactory, $log, $mdMedia) {
    var vm = this;

    vm.getConditions = getConditions;
    vm.getShownStatus = getShownStatus;
    vm.getImageUrl = getImageUrl;
    vm.$onInit = initialize;
    vm.cycleManual = cycleManual;
    vm.setManual = setManual;
    vm.setAll = setAll;

    $scope.includeAll = false;
    $scope.excludeAll = false;

    ////////////

    function initialize() {
      $scope.$mdMedia = $mdMedia;

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

    function getShownStatus(condition, ignoreOverrides) {
      if (!angular.isDefined(ignoreOverrides)) {
        ignoreOverrides = false;
      }
      if (!vandaidFieldService.isReady()) {
        return true;
      }

      if (!ignoreOverrides) {
        if (vm.va.manual_exclude[condition.id]) {
          return false;
        }
        if (vm.va.manual_include[condition.id]) {
          return true;
        }
      }

      return (
        (
          (condition.preventable && vm.va.adol_preventable[1]) ||
          (!condition.preventable && vm.va.adol_preventable[2])
        )
        &&
        (
          (condition.treatable && vm.va.adol_treatable[1]) ||
          (!condition.treatable && vm.va.adol_treatable[2])
        )
        &&
        (!condition.adult_onset || vm.va.adol_adult_onset == "1")
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

        $scope.includeAll = false;
        $scope.excludeAll = false;
      } catch (e) {
        $log.log('Error setting manual *clusion: ' + e);
      }
    }

    function setManual(conditionId, value) {
      if (!conditionId) return;

      try {
        if (value) { // true is for manual include
          vm.va.manual_include[conditionId] = !vm.va.manual_include[conditionId];
          if (vm.va.manual_include[conditionId]) {
            vm.va.manual_exclude[conditionId] = false;
          }
        } else {
          vm.va.manual_exclude[conditionId] = !vm.va.manual_exclude[conditionId];
          if (vm.va.manual_exclude[conditionId]) {
            vm.va.manual_include[conditionId] = false;
          }
        }

        $scope.includeAll = false;
        $scope.excludeAll = false;
      } catch (e) {
        $log.log('Error setting manual *clusion: ' + e);
      }
    }

    function setAll(value) {
      var includeVal = value, excludeVal = !value;

      // If all included or all excluded and pressed again, cancel that action
      if (value && $scope.includeAll || !value && $scope.excludeAll) {
        includeVal = false;
        excludeVal = false;
      }

      angular.forEach(vm.va.manual_include,
        function (val, key) {
          vm.va.manual_include[key] = includeVal;
        });

      angular.forEach(vm.va.manual_exclude,
        function (val, key) {
          vm.va.manual_exclude[key] = excludeVal;
        });

      $scope.includeAll = includeVal;
      $scope.excludeAll = excludeVal;
    }

    function getImageUrl(value) {
      var prefix = '/content/img/';

      if (!value || typeof (value) !== 'string') return;

      switch (value.toUpperCase()) {
        case 'ADRENAL':
          return prefix + 'kidneys.png';
        case 'BONE':
          return prefix + 'bone.png';
        case 'BRAIN':
          return prefix + 'brain.png';
        case 'CANCER':
        case 'TUMOR':
          return prefix + 'cancer.png';
        case 'EYE':
          return prefix + 'eye.png';
        case 'HEART':
          return prefix + 'heart.png';
        case 'IMMUNE':
          return prefix + 'immune.png';
        case 'JOINT':
        case 'CONNECTIVE':
          return prefix + 'joint.png';
        case 'KIDNEY':
          return prefix + 'kidneys.png';
        case 'LIVER':
          return prefix + 'liver.png';
        case 'LUNG':
          return prefix + 'lungs.png';
        case 'MEDICINE':
          return prefix + 'medicines.png';
        case 'MULTI':
          return prefix + 'person.png';
        case 'MUSCLE':
          return prefix + 'muscle.png';
        case 'NERVE':
        case 'PAIN':
          return prefix + 'nerves.png';
        case 'PANCREAS':
          return prefix + 'pancreas.png';
        case 'STOMACH':
          return prefix + 'gi_tract.png';

        case 'VASDEFERENS':
          return prefix + 'scrotum.png';
        case 'VESSEL':
          return prefix + 'vessel.png';
        default:
          $log.log('Organ system not found:' + value);
          return prefix + 'person.png';
      }
    }

  }

})();

