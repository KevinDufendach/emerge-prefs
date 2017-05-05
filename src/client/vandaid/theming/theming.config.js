(function () {
  'use strict';

  angular
    .module('va.theming')
    .config(mainThemeProvider);

  mainThemeProvider.$inject = ['$mdThemingProvider', '__va'];

  function mainThemeProvider($mdThemingProvider, __va) {

    if (__va.primaryPalette && __va.accentPalette) {
      $mdThemingProvider
        .theme('default')
        .primaryPalette(__va.primaryPalette)
        .accentPalette(__va.accentPalette);
    } else {
      $mdThemingProvider
        .theme('default')
        .primaryPalette('vanderbiltPrimary')
        .accentPalette('blue-grey');
    }

  }

})();