/**
 * Created by REIR8P on 5/2/2017.
 */
// Based on https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/

(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.apiUrl = 'https://vandaid-165711.appspot.com/';

  // Base url
  window.__env.baseUrl = '/';

  // Canvas uri
  window.__env.canvasUri = '/projects/vandaid_test/test.html';

  // Form name
  window.__env.formName = 'my_first_instrument';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));