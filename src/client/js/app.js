var tb = new KrdToolbox(angular.$q);

(function () {
  "use strict";

  var USE_COOKIES = false;
  var DEBUG_LEVEL = 2;
  var REDCAP = "REDCAP";
  var LOCAL = "LOCAL";

  var app = angular.module('Vand-AID', ['library-canvas',
    'va-sidebox', 'ngResource', 'ngAnimate',
    'ngMaterial', 'ngSanitize', 'menuBar', 'va-topbar']);

  /**
   * Cookie functions from http://www.w3schools.com/js/js_cookies.asp
   * @param cname
   * @param cvalue
   * @param exdays
   */
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  /**
   * Cookie functions from http://www.w3schools.com/js/js_cookies.asp
   * @param cname key of the cookie
   * @returns {*} string representation of a cookie value
   */
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  app.directive('username', function () {
    return {
      restrict: 'E',
      templateUrl: 'library/username.html',
      controller: function ($scope) {

      }
    }
  });

  app.directive('fieldPane', function() {
    return {
      restrict : 'E',
      templateUrl : 'library/field-pane.html',
      scope: {
        field: '=' ,
        fm: '='
          },
      link: function(scope, element, attrs) {
        scope.fieldAlign = attrs.fieldAlign || "vertical";
      },
      controller: function($scope) {

        $scope.getWidgetType = function( fieldType ) {
          switch (fieldType) {
            case "radio":
            case "yesno":
            case "truefalse":
              return "fields/radio.html";
            case "checkbox":
              return "fields/checkbox.html";
            case "checklist":
              return "fields/checklist.html";
            case "text":
            case "notes":
            default:
              return "fields/text.html";
          }
        };
      },
      controllerAs: 'fieldCtrl'

    };

  });

})();

