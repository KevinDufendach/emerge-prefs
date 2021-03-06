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
  window.__va.primaryPalette = 'ccteal';
  window.__va.accentPalette = 'ccpink';

  // Navigation
  window.__va.top_bar_background = 'grey-50';
  window.__va.side_bar_background = 'primary-500';
  window.__va.submit_button_class = 'md-accent';
  window.__va.submit_button_text = 'Preferences Saved';

  // Logo
  window.__va.logo = '/content/img/CCHMC_logo_ht128px.png';

  // Title
  window.__va.title = 'Decision Aid for Return of Genetic Results';

  // Instructions
  window.__va.instructionsTemplateHtml = '/app/instructions-template.html';

  // REDCap
  window.__va.formName = 'adolescent_preferences';
  window.__va.fieldSuffix = '_adol';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__va.enableDebug = true;
}(this));
