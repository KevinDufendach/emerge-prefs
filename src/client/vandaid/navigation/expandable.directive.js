/**
 * Reference:
 * vAccordion - AngularJS multi-level accordion component
 * @version v1.5.1
 * @link http://lukaszwatroba.github.io/v-accordion
 * @author Łukasz Wątroba <l@lukaszwatroba.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (angular) {
  'use strict';

  angular
    .module('va.tools')
    .directive('expandable', ExpandDirective)
    .animation('.expanded', ExpandAnimation);

  function ExpandDirective() {
    var directive = {
      restrict: 'E',
      compile: compileFn
    };
    return directive;

    function compileFn(element) {
      // wrap tag
      var contents = element.html();
      element.html('<expandable-content style="{margin:0 !important; padding:0 !important}" ><div>' + contents + '</div></expandable-content>');
    }
  }

  ExpandAnimation.$inject = ['$animateCss'];

  function ExpandAnimation($animateCss) {
    return {
      addClass: function (element, className, done) {
        // console.log('expand class added');

        var paneContent = angular.element(element[0].querySelector('expandable-content')),
          paneInner = angular.element(paneContent[0].querySelector('div'));

        var height = paneInner[0].offsetHeight;
        // Note: offsetHeight does not include margin if specified by inner content

        var expandAnimation = $animateCss(paneContent, {
          easing: 'ease',
          from: {maxHeight: '0px'},
          to: {maxHeight: height + 'px'},
          duration: 0.25
        });

        expandAnimation.start().done(function () {
          paneContent.css('max-height', 'none');
          done();
        });

        return function (isCancelled) {
          if (isCancelled) {
            paneContent.css('max-height', 'none');
          }
        };

      },
      removeClass: function (element, className, done) {
        // console.log('expand class removed');

        var paneContent = angular.element(element[0].querySelector('expandable-content')),
          paneInner = angular.element(paneContent[0].querySelector('div'));

        var height = paneInner[0].offsetHeight;
        // Note: offsetHeight does not include margin if specified by inner content

        var collapseAnimation = $animateCss(paneContent, {
          easing: 'ease',
          from: {maxHeight: height + 'px'},
          to: {maxHeight: '0px'},
          duration: 0.25
        });

        collapseAnimation.start().done(done);

        return function (isCancelled) {
          if (isCancelled) {
            paneContent.css('max-height', '0px');
          }
        };
      }
    };
  }
})(angular);