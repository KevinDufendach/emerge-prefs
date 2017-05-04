/**
 * Created by REIR8P on 5/2/2017.
 */
// Based on https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/

(function (window) {
  window.__va = window.__va || {};

  // API url
  window.__va.apiUrl = 'https://vandaid-165711.appspot.com/';

  // Base url
  window.__va.baseUrl = '/';

  // Canvas uri
  window.__va.canvasUri = '/projects/vandaid_test/test.html';

  // Form name
  window.__va.formName = 'my_first_instrument';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__va.enableDebug = true;
}(this));