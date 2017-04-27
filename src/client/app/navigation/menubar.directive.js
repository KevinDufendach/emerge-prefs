(function () {
  'use strict';

  angular
    .module('app.nav')
    .directive('vandaidMenuBar', MenuBarDirective);

  MenuBarDirective.$inject = ['$mdDialog'];

  function MenuBarDirective($mdDialog) {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/navigation/menubar.directive.html',
      controller: MenuBarController,
      controllerAs: 'ctrl'
    };
    return directive;

    //////////

    function MenuBarController() {
      this.settings = {
        printLayout: true,
        showRuler: true,
        showSpellingSuggestions: true,
        presentationMode: 'edit'
      };
      this.sampleAction = function(name, ev) {
        $mdDialog.show($mdDialog.alert()
          .title(name)
          .textContent('You triggered the "' + name + '" action')
          .ok('Great')
          .targetEvent(ev)
        );
      };
    }
  }
})();
