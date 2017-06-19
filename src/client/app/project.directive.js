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

  EmergePrefsController.$inject = ['vandaidFieldService', '$scope', 'conditionFactory', '$log', '$mdMedia', '$mdColors'];

  /* @ngInject */
  function EmergePrefsController(vandaidFieldService, $scope, conditionFactory, $log, $mdMedia, $mdColors) {
    var vm = this;

    vm.getCategories = getCategories;
    vm.getConditionsByCategory = getConditionsByCategory;
    vm.getShownStatus = getShownStatus;
    vm.getImageUrl = getImageUrl;
    vm.$onInit = initialize;
    vm.cycleManual = cycleManual;
    vm.setManual = setManual;
    vm.setAll = setAll;

    $scope.includeAll = false;
    $scope.excludeAll = false;
    $scope.$mdColors = $mdColors;

    ////////////

    function initialize() {
      $scope.$mdMedia = $mdMedia;

      vandaidFieldService.getFields().then(
        function () {
          $scope.va = vandaidFieldService.values;
          vm.va = vandaidFieldService.values;
        }
      );
    }

    function getCategories() {
      return conditionFactory.categoryList;
    }

    function getConditionsByCategory(category) {
      if (angular.isDefined(conditionFactory.data[category])) {
        return conditionFactory.data[category];
      } else {
        $log.warn('requested category [' + category + '] that does not exist');
        return [];
      }
    }

    /**
     * Returns whether or not a condition should be shown based on the currently selected logic
     *
     * @param condition The specific condition to be shown
     * @param ignoreOverrides {boolean} if set to TRUE, will ignore global override settings and only use conditional
     * logic
     * @returns {*} boolean of whether or not the condition should be shown
     */
    function getShownStatus(condition, ignoreOverrides) {
      if (!angular.isDefined(ignoreOverrides)) {
        ignoreOverrides = false;
      }
      if (!vandaidFieldService.isReady()) {
        return true;
      }

      if (vm.va.include_all === "0") {
        return false;
      }

      if (!ignoreOverrides) {
        if (vm.va['manual_exclude___' + condition.id]) {
          return false;
        }
        if (vm.va['manual_include___' + condition.id]) {
          return true;
        }
      }

      return (
        (condition.preventable || vm.va.adol_preventable == "1")
        &&
        (condition.treatable || vm.va.adol_treatable == "1")
        &&
        (!condition.adult_onset || vm.va.adol_adult_onset == "1")
      )
    }

    function cycleManual(conditionId) {
      if (!conditionId) return;

      try {
        if (vm.va['manual_include___' + conditionId]) {
          vm.va['manual_include___' + conditionId] = false;
          vm.va['manual_exclude___' + conditionId] = true;
        } else if (vm.va['manual_exclude___' + conditionId]) {
          vm.va['manual_include___' + conditionId] = false;
          vm.va['manual_exclude___' + conditionId] = false;
        } else {
          vm.va['manual_include___' + conditionId] = true;
          vm.va['manual_exclude___' + conditionId] = false;
        }

        $scope.includeAll = false;
        $scope.excludeAll = false;
      } catch (e) {
        $log.log('Error setting manual *clusion: ' + e);
      }
    }

    function setManual(conditionId, value) {
      if (!conditionId || typeof(conditionId) !== 'string') return;

      try {
        if (value) { // true is for manual include
          vm.va['manual_include___' + conditionId] = !vm.va['manual_include___' + conditionId];
          if (vm.va['manual_include___' + conditionId]) {
            vm.va['manual_exclude___' + conditionId] = false;
          }
        } else {
          vm.va['manual_exclude___' + conditionId] = !vm.va['manual_exclude___' + conditionId];
          if (vm.va['manual_exclude___' + conditionId]) {
            vm.va['manual_include___' + conditionId] = false;
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

      angular.forEach(vm.va,
        function (val, key) {
          if (key.substr(0, 17) === 'manual_include___') {
            vm.va[key] = includeVal;
          }
          if (key.substr(0, 17) === 'manual_exclude___') {
            vm.va[key] = excludeVal;
          }
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

