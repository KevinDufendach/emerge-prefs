(function () {
  'use strict';

  /* @ngInject */
  angular
    .module('app.theming')
    .config(cchmcThemeProvider);

  cchmcThemeProvider.$inject = ['$mdThemingProvider'];

  function cchmcThemeProvider($mdThemingProvider) {

    $mdThemingProvider.definePalette('ccmedpurple', {
      '50': '#f9f2f6',
      '100': '#e0bdd2',
      '200': '#ce97b8',
      '300': '#b76797',
      '400': '#ae5288',
      '500': '#994878',
      '600': '#843e68',
      '700': '#6f3457',
      '800': '#5b2b47',
      '900': '#462137',
      'A100': '#f9f2f6',
      'A200': '#e0bdd2',
      'A400': '#ae5288',
      'A700': '#6f3457',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });

    $mdThemingProvider.definePalette('ccpurple', {
      '50': '#edc3e4',
      '100': '#db89c8',
      '200': '#ce5eb5',
      '300': '#af3594',
      '400': '#972e80',
      '500': '#80276c',
      '600': '#692058',
      '700': '#511944',
      '800': '#3a1231',
      '900': '#220a1d',
      'A100': '#edc3e4',
      'A200': '#db89c8',
      'A400': '#972e80',
      'A700': '#511944',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });

    $mdThemingProvider.definePalette('ccgreen', {
      '50': '#f5fceb',
      '100': '#d1f1aa',
      '200': '#b8e97a',
      '300': '#97de3d',
      '400': '#89d824',
      '500': '#78be20',
      '600': '#67a41c',
      '700': '#578a17',
      '800': '#466f13',
      '900': '#36550e',
      'A100': '#e8ffcc',
      'A200': '#c6ff80',
      'A400': '#7be000',
      'A700': '#549900',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 500 600 A100 A200 A400'
    });

    $mdThemingProvider.definePalette('ccteal', {
      '50': '#d1f9ff',
      '100': '#85f0ff',
      '200': '#4de9ff',
      '300': '#05e0ff',
      '400': '#00c9e6',
      '500': '#00aec7',
      '600': '#0093a8',
      '700': '#00788a',
      '800': '#005e6b',
      '900': '#00434d',
      'A100': '#99f1ff',
      'A200': '#30d0e8',
      'A400': '#009bb3',
      'A700': '#005866',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 A100 A200'
    });

    $mdThemingProvider.definePalette('ccgray', {
      '50': '#dadcdd',
      '100': '#b3b6b8',
      '200': '#969a9d',
      '300': '#72777a',
      '400': '#63676a',
      '500': '#54585a',
      '600': '#45494a',
      '700': '#36393a',
      '800': '#282a2a',
      '900': '#191a1b',
      'A100': '#dadcdd',
      'A200': '#b3b6b8',
      'A400': '#63676a',
      'A700': '#36393a',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });

    $mdThemingProvider.definePalette('ccpink', {
      '50': '#ffffff',
      '100': '#fbe7ee',
      '200': '#f3b7cc',
      '300': '#e979a0',
      '400': '#e45f8e',
      '500': '#e0457b',
      '600': '#dc2b68',
      '700': '#c7215b',
      '800': '#ac1d4f',
      '900': '#921843',
      'A100': '#f075a0',
      'A200': '#da2564',
      'A400': '#910838',
      'A700': '#660024',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 A100'
    });

    $mdThemingProvider.definePalette('cclightgreen', {
      '50': '#ffffff',
      '100': '#e9f4ce',
      '200': '#d4eaa0',
      '300': '#badd65',
      '400': '#afd84c',
      '500': '#a4d233',
      '600': '#92bd2a',
      '700': '#7fa424',
      '800': '#6b8b1f',
      '900': '#587219',
      'A100': '#ffffff',
      'A200': '#e9f4ce',
      'A400': '#afd84c',
      'A700': '#7fa424',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 500 600 700 A100 A200 A400 A700'
    });
  }

})();