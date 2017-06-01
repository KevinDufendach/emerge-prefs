(function () {
  'use strict';

  angular
    .module('va')
    .config(function ($mdToastProvider) {
      $mdToastProvider
        .addPreset('testPreset', {
          options: function () {
            return {
              template: '<md-toast>' +
              '<div class="md-toast-content">' +
              'This is a custom preset' +
              '</div>' +
              '</md-toast>',
              controllerAs: 'toast',
              bindToController: true
            };
          }
        });
    })
})();