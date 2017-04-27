/**
 * Created by REIR8P on 4/27/2017.
 */
(function() {
  'use strict';

  angular
    .module('app.user')
    .factory('userService', UserService);

  function UserService() {
    var service = {
      isLoggedIn: isLoggedIn
    };
    return service;

    //////////

    function isLoggedIn() {
      return false;
    }

  }

})();