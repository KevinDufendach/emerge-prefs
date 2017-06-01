(function () {
  'use strict';

  angular
    .module('va.nav')
    .directive('vaTopBar', topBar);


  /* @ngInject */
  function topBar() {
    var directive = {
      bindToController: true,
      templateUrl: '/vandaid/navigation/topbar.directive.html',
      controller: topBarController,
      controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        expanded: '='
      }
    };
    return directive;
  }

  topBarController.$inject = ['vandaidUserService', '__va', 'vandaidFieldService', '$vaThemingService', '$mdMedia', '$mdToast', '$log'];

  /* @ngInject */
  function topBarController(vandaidUserService, __va, vandaidFieldService, $vaThemingService, $mdMedia, $mdToast, $log) {
    var vm = this;

    vm.toggleSidenav = toggleSidenav;
    vm.isLoggedIn = vandaidUserService.isLoggedIn();
    vm.getLogo = getLogo;
    vm.getBackground = getBackground;
    vm.submit = submit;
    vm.$mdMedia = $mdMedia;

    vm.title = __va.title || 'VandAID - Active Interface Design';

    //////////////

    function submit() {
      vandaidFieldService.submit().then(
        // on success
        function() {
          // $log.log('successfully submitted to REDCap');
          // $mdToast.testPreset();
          var toast = $mdToast.simple()
            .textContent(__va.submit_button_text || 'Successfully saved to REDCap')
            .position('top right')
            .hideDelay(3000);

          $mdToast.show(toast);
        },
        function() {
          $log.log('Unsuccessful submission to REDCap');
          $mdToast.testPreset();
        }

      )
    }

    function toggleSidenav(navID) {
      // $mdSidenav(navID).toggle();
    }

    function getLogo() {
      return __va.logo || '/vandaid/content/img/Vanderbilt-Logo-white500x500.png';
    }

    function getBackground() {
      return $vaThemingService.getTopBarBackground();
    }
  }

})();

