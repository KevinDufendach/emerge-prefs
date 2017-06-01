/**
 * Created by REIR8P on 4/27/2017.
 */
(function () {
  'use strict';

  angular
    .module('va.user')
    .factory('vandaidUserService', UserService);

  UserService.$inject = ['vaTools', '$q', '$http'];

  function UserService(appTools, $q, $http) {
    var self = this;

    var states = {
      INITIAL: 0,
      VERIFYING: 1,
      LOGGED_OUT: 2,
      SET: 3,
      UNAUTHORIZED: 4,
      LOGGED_IN: 5
    };

    var state = states.INITIAL;
    var user = initializeUser();

    verifyUser(user.id, user.key);

    var service = {
      isLoggedIn: isLoggedIn,
      getUser: getUser,
      getState: getState,
      verifyUser: verifyExistingUser,
      userConstructor: User
    };
    return service;

    //////////

    /**
     * Constructor for a User object that will obtain "id" and "key" from a GET request
     *
     * @constructor
     */
    function User(template) {
      this.id = template.id || "undefined";
      this.key = template.key || "unspecified";
      this.name = template.name || this.id;
    }

    /**
     * Returns true for state of SET or better
     *
     * @return {boolean}
     */
    function isLoggedIn() {
      return state >= states.SET;
    }

    /**
     * Verify
     *
     * @returns {*}
     */
    function verifyExistingUser() {
      return $q(function(resolve, reject) {
        if (state > 3) {
          if (isLoggedIn()) {
            resolve();
          } else {
            reject();
          }
        } else {
          verifyUser(user.id, user.key).then(
            function(val) {
              resolve(val);
            },
            function(val) {
              reject(val);
            }
          )
        }
      });
    }

    /**
     * Verifies a user id and key
     *
     * @return {*}
     */
    function verifyUser(id, key) {
      self.state = Math.max(states.VERIFYING, state);

      return $q(function (resolve, reject) {
        var params = {
          method: "post",
          url: "/rest/validate-user",
          data: {
            id: id,
            key: key
          }
        };

        $http(params).then(
          // on success
          function (returnData) {
            console.log('User ' + returnData.data);

            if (returnData.data === 'AUTHORIZED') {
              state = states.LOGGED_IN;
            } else {
              state = states.UNAUTHORIZED;
            }

            resolve();
          },
          // on failure
          function (returnData) {
            console.log('verify request failed: ' + returnData);
            reject();
          }
        )
      });
    }

    /**
     * Returns the current user
     *
     * @return {*}
     */
    function getUser() {
      return user;
    }

    /**
     * Returns the current state
     *
     * @return {number}
     */
    function getState() {
      return state;
    }

    /**
     * Checks for a GET request and loads the embedded username and key.
     * If not found, creates a "default" user
     *
     * @return
     */
    function initializeUser() {
      var user = new User({
          id: appTools.get('id'),
          key: appTools.get('key')
        }
      );

      if (user.id !== 'undefined' && user.key !== 'unspecified') {
        state = states.SET;
      }

      return user;
    }

  }

})();