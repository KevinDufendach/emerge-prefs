(function () {
  'use strict';

  angular
    .module('va.theming')
    .factory('$vaThemingService', themingService);

  themingService.$inject = ['__va'];

  /* @ngInject */
  function themingService(__va) {
    var service = {
      getTopBarBackground: getTopBarBackground,
      getSideBarBackground: getSideBarBackground
    };
    return service;

    ////////////////

    function getTopBarBackground() {
      return (__va.top_bar_background || 'primary-800');
    }

    function getSideBarBackground() {
      return (__va.side_bar_background || 'accent-50');
    }
  }

})();

