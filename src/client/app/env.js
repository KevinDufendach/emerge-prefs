/**
 * Created by REIR8P on 5/2/2017.
 */
// Based on https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/

if (typeof Object.assign !== 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target === null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource !== null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

(function (window) {
  window.__va = window.__va || {};

  // API url
  window.__va.apiUrl = 'https://vandaid-165711.appspot.com/';

  // Base url
  window.__va.baseUrl = '/';

  // Palette
  // window.__va.primaryPalette = 'cyan';
  // window.__va.accentPalette = 'pink';

  // Logo
  // window.__va.logo = '/projects/vandaid_test/img/CCHMC_CBI_TAG_TM_RGB_400px_lores.jpg';
  // window.__va.logoBackground = '#F0F0F0';

  // Canvas uri
  window.__va.canvasUri = '/src/client/projects/vandaid_test/test.html';

  // Form name
  window.__va.formName = 'my_first_instrument';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__va.enableDebug = true;
}(this));