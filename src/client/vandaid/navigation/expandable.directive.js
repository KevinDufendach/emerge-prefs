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
    .animation('.v-expanded', VerticalExpandAnimation)
    .animation('.h-expanded', HorizontalExpandAnimation);

  function ExpandDirective() {
    var directive = {
      restrict: 'E',
      compile: compileFn
    };
    return directive;

    function compileFn(elem, attrs) {
      var contents = elem.html();

      var dir = 'vertical';
      // wrap tag using attrs.direction to determine direction for expansion. Default is 'vertical'
      if (!attrs.direction || attrs.direction !== 'horizontal') {
        elem.html('<expandable-content class="expand-vertical"><div>' + contents + '</div></expandable-content>');
      } else {
        dir = 'horizontal';
        elem.html('<expandable-content class="expand-horizontal"><div>' + contents + '</div></expandable-content>');
      }

      try {
        var paneContent = angular.element(elem[0]);
        var paneInner = angular.element(paneContent[0].querySelector('expandable-content'));
        var paneDiv = angular.element(paneInner[0].querySelector('div'));
      } catch (e) {
        $log.error(e.message);
      }

      if (dir === 'vertical') {
        var height = paneDiv[0].offsetHeight;

        try {
          // Add maxHeight to the element
          paneInner.css('maxHeight', height + 'px');
        } catch (e) {
          $log.error(e.message);
        }

      } else {
        var width = paneDiv[0].offsetWidth;

        try {
          // Add maxWidth to the element
          paneInner.css('maxWidth', width + 'px');
        } catch (e) {
          $log.error(e.message);
        }
      }
    }
  }

  VerticalExpandAnimation.$inject = ['$animateCss', '$log'];
  function VerticalExpandAnimation($animateCss, $log) {
    return {
      addClass: function (element, className, done) {
        // console.log('expand class added');

        var paneContent = angular.element(element[0]);
        var paneInner = angular.element(paneContent[0].querySelector('expandable-content'));
        var paneDiv = angular.element(paneInner[0].querySelector('div'));

        var height = paneDiv[0].offsetHeight;
        $log.log('paneDiv opening offsetHeight: ' + height);
        // Note: offsetHeight does not include margin if specified by inner content

        var expandAnimation = $animateCss(paneInner, {
          easing: 'ease',
          from: {maxHeight: '0'},
          to: {maxHeight: height + 'px'},
          duration: 0.25
        });

        expandAnimation.start().done(function () {
          paneInner.css('max-height', 'none');
          done();
        });

        return function (isCancelled) {
          if (isCancelled) {
            paneInner.css('max-height', 'none');
          }
        };

      },
      removeClass: function (element, className, done) {
        // console.log('expand class removed');

        // var paneContent = angular.element(element[0].querySelector('expandable')),
        //   paneInner = angular.element(paneContent[0].querySelector('expandable-content'));

        var paneContent = angular.element(element[0]);
        var paneInner = angular.element(paneContent[0].querySelector('expandable-content'));
        var paneDiv = angular.element(paneInner[0].querySelector('div'));

        var height = paneDiv[0].offsetHeight;
        $log.log('paneDiv closing offsetHeight: ' + height);
        // Note: offsetHeight does not include margin if specified by inner content

        var collapseAnimation = $animateCss(paneInner, {
          easing: 'ease',
          from: {maxHeight: height + 'px'},
          to: {maxHeight: '0px'},
          duration: 0.25
        });

        collapseAnimation.start().done(done);

        return function (isCancelled) {
          if (isCancelled) {
            paneInner.css('max-height', '0px');
          }
        };
      }
    };
  }

  HorizontalExpandAnimation.$inject = ['$animateCss', '$log'];
  function HorizontalExpandAnimation($animateCss, $log) {
    return {
      addClass: function (elem, className, done) {
        // console.log('expand class added');

        var paneContent = angular.element(elem[0]);
        var paneInner = angular.element(paneContent[0].querySelector('expandable-content'));
        var paneDiv = angular.element(paneInner[0].querySelector('div'));

        var width = paneDiv[0].offsetWidth;
        $log.log('Opening paneDiv offsetWidth: ' + width);
        // Note: offsetHeight does not include margin if specified by inner content

        var expandAnimation = $animateCss(paneInner, {
          easing: 'ease',
          from: {maxWidth: '0'},
          to: {maxWidth: width + 'px'},
          duration: 0.25
        });

        expandAnimation.start().done(function () {
          paneInner.css('max-width', 'none');
          done();
        });

        return function (isCancelled) {
          if (isCancelled) {
            paneInner.css('max-width', 'none');
          }
        };

      },
      removeClass: function (element, className, done) {
        // console.log('expand class removed');

        // var paneContent = angular.element(element[0].querySelector('expandable')),
        //   paneInner = angular.element(paneContent[0].querySelector('expandable-content'));

        var paneContent = angular.element(element[0]);
        var paneInner = angular.element(paneContent[0].querySelector('expandable-content'));
        var paneDiv = angular.element(paneInner[0].querySelector('div'));

        var width = paneDiv[0].offsetWidth;
        $log.log('Closing paneDiv offsetWidth: ' + width);
        // Note: offsetHeight does not include margin if specified by inner content

        var collapseAnimation = $animateCss(paneInner, {
          easing: 'ease',
          from: {maxWidth: width + 'px'},
          to: {maxWidth: '0px'},
          duration: 0.25
        });

        collapseAnimation.start().done(done);

        return function (isCancelled) {
          if (isCancelled) {
            paneInner.css('max-width', '0px');
          }
        };
      }
    };
  }
})(angular);