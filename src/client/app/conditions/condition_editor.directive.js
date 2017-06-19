(function () {
  'use strict';

  angular
    .module('app.conditions')
    .directive('conditionEditor', conditionEditor);

  conditionEditor.$inject = [];

  /* @ngInject */
  function conditionEditor() {
    var directive = {
      bindToController: true,
      controller: conditionEditorCtrl,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {},
      templateUrl: '/app/conditions/condition_editor.directive.html'
    };
    return directive;

  }

  conditionEditorCtrl.$inject = ['conditionFactory', '$log', '$scope'];

  /* @ngInject */
  function conditionEditorCtrl(conditionFactory, $log, $scope) {
    $log.log('condition Editor loaded');

    var ctrl = this;

    $scope.data = conditionFactory.data;
    $scope.categoryList = conditionFactory.categoryList;
  }

})();


