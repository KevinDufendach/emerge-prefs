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

  // Palette

  window.__va.primaryPalette = 'cyan';
  window.__va.accentPalette = 'deep-purple';

  // Logo
  window.__va.logo = '/src/client/content/img/CCHMC_CBI_TAG_TM_RGB_400px_lores.jpg';
  window.__va.logoBackground = '#F0F0F0';

  // Title
  // window.__va.title = 'Genetic Information Preferences Survey';

  // Form name
  window.__va.formName = 'adolescent_preferences';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__va.enableDebug = true;
}(this));
