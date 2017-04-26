(function () {
  /**
   * *****************************************************************
   * App controller
   * *****************************************************************
   */
  angular
    .module('app')
    .controller("VandAIDApp", VandAIDApp);

  VandAIDApp.$inject = ['$http', '$q', '$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia'];

  function VandAIDApp($http, $q, $scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia) {
    var self = this;

    var loadFields = function (user) {
      var uri = "/resources/metadata_test.json";

      $scope.fm.loadMetadataFieldsFromFile(uri, "vandaidfields").then(
        // on success
        function () {
          // $scope.fm.initialize(data, "vandaidfields");

          if (typeof(user) != "undefined") {
            loadDefaults(user.key);
          } else {
            loadDefaults();
          }
        },

        // on failure
        function () {

        }
      );
    };

    /**
     * Loads defaults for fields from a JSON file. Creates uri based on key, passes the uri to the
     * fieldManager for processing. Uses default as fallback.
     *
     * @param key used to define a filename
     */
    var loadDefaults = function (key) {

      // Load status of selected items
      var fields_filename;
      if (typeof(key) != "undefined") {
        fields_filename = "/data/" + key + ".data.json";
      } else {
        fields_filename = "/resources/defaults_record_export.json";
      }

      $scope.fm.loadValuesFromFile(fields_filename).then(
        function () {
          // no fallback needed if succeeds
        },

        // on failure
        function () {
          if (typeof(key) != "undefined") {
            loadDefaults();
          }
        }
      );

      console.log("Attempting to load from " + fields_filename);
      $http.get(fields_filename).then(
        // on default record found and loaded
        function (data) {
          $scope.fm.loadFieldValues(data.data[0]);
        },
        // on failure
        function () {
          console.log("Unable to load values from " + fields_filename);
          if (typeof(key) != "undefined") {
            loadDefaults();
          }

        }
      );
    };

    /**
     * [[ Deprecated - should not need to load items separate from fields ]]
     *
     * Loads items from a JSON resource
     * @param filename
     * @param $resource
     */
    var loadItems = function (filename) {
      var defaultFilename = "/resources/items.json";

      if (typeof(filename) == "undefined") {
        filename = defaultFilename;
      }

      filename = defaultFilename;

      $http.get(filename).then(
        function (data) {
          // setTimeout(function() {
          console.log("timeout finished, initializing items");
          $scope.itemManager.initialize(data.data.items);

          // }, 3000);

        }, function () {
          showSimpleToast("Unable to find " + filename);

          // escape if fail at getting default
          if (filename == defaultFilename) return;
          loadItems();
        });
    };

    /**
     * Basic constructor for a {User} object
     * @constructor
     */
    function User() {
      this.id = "";
      this.key = "";
      this.name = "";
      this.logged_in = false;
      this.source = "";
      this.consented = false;
    }

    /**
     * Checks for a GET request and loads the embedded username and key.
     * If not found, creates a "default" user
     * @returns {User}
     */
    var getUser = function () {
      /**
       * Check for GET requests with embedded username and key
       */

      var user = new User();
      user.id = tb.get("id") || "default";
      user.key = tb.get("key") || "undefined";
      user.name = user.id;
      user.consented = !!+tb.get("consent") || false;

      if (user.id != "default" && user.key != "undefined") {
        user.logged_in = true;
        user.source = "POST";
      } else {
        user.logged_in = false;
        user.source = "GENERATED";
        user.consented = true;
      }

      return user;
    };

    $scope.toggleToolbox = function (val) {
      if (typeof val === 'undefined') {
        val = $scope.tabData.hide;
      }

      $scope.tabData.hide = !val;
    };

    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.resetFields = function () {
      loadFields();
    };

    /**
     * Submits data to REDCap
     */
    $scope.submitData = function () {
      var data = $scope.fm.getREDCapFields($scope.user.id);

      var pm = new tb.PromiseManager();

      pm.addPromise($scope.fm.submitData(data, $scope.user));
      pm.addPromise($scope.fm.saveData(data, $scope.user));

      pm.runAsync(
        function () {
          // on success, proceed to system usability scale
          var url = "/system-usability-scale.html?id=" + $scope.user.id + "&key=" + $scope.user.key + "&consent=" + ($scope.user.consented ? "1" : "0");

          window.location.href = url;
        },
        function () {
          showSimpleToast("There was an error submitting and/or saving data. Please try again.");
        }
      );
    };

    /**
     * Saves data to a JSON file
     */
    $scope.saveData = function () {
      var data = $scope.fm.getREDCapFields($scope.user.id);

      $scope.fm.saveData(data, $scope.user).then(
        function () {
          showSimpleToast("Data saved");
          $scope.autoSaveTime = new Date();
        },
        function () {
          showSimpleToast("There was an error saving the data");
        }
      );
    };

    /**
     * Displays a short, unobtrusive message on the screen
     *
     * @param toastContent The content of the message
     */
    var showSimpleToast = function (toastContent) {
      $mdToast.show(
        $mdToast.simple()
          .content(toastContent)
          .position('top right')
          .hideDelay(3000)
      );
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }


    $scope.showInstructions = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/library/instructions.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

    };

    var originatorEv;
    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.toggle = tb.toggle;
    $scope.exists = tb.exists;

    /** ***************************************************************
     *                    BEGIN VARIABLE DECLARATIONS
     * @type {Array}
     * ****************************************************************
     */

    $scope.isReady = false;

    $scope.fm = new FieldManager($http, $q);
    $scope.itemManager = new ItemManager();

    var fmObserver = new Observer();
    fmObserver.update = function (newValue, oldValue) {
      if ($scope.fm.isReady && $scope.itemManager.isReady()) {
        $scope.isReady = true;
      }
    };
    $scope.fm.addObserver(fmObserver);

    var imObserver = new Observer();
    imObserver.update = function (newValue, oldValue) {
      $scope.isReady = $scope.fm.isReady && $scope.itemManager.isReady();
    };
    $scope.itemManager.addObserver(imObserver);

    $scope.vaOptions = {
      show_labels: false
    };


    $scope.apiData = "";

    $scope.showToolbox = true;
    $scope.showSettings = false;

    $scope.tabData = {
      selectedIndex: 0
    };

    $scope.user = getUser();
    console.log("Username: " + $scope.user.id);

    if (!$scope.user.consented) {
      window.location.href = "consent_declined.html";
    }

    if ($scope.user.logged_in) {
      loadFields($scope.user);
    } else {
      loadFields();
    }
    if (USE_COOKIES) setCookie("username", $scope.user.id, 365);
    loadItems();

    $scope.username = $scope.user.id;

    $scope.dataSubmitted = false;

    window.setTimeout(
      function () {
        $scope.saveData();
      },
      30000
    );

    $scope.needsSaveTip = false;

    // Set alert so user doesn't navigate away from page
    window.onbeforeunload = function () {
      if (!$scope.dataSubmitted && $scope.user.consented) {
        $scope.needsSaveTip = true;
        return "You have not submitted your design";
      }
    };

    // Register Ctrl+S
    // http://stackoverflow.com/questions/11362106/how-do-i-capture-a-ctrl-s-without-jquery-or-any-other-library
    var isCtrl = false;
    document.onkeyup = function (e) {
      if (e.keyCode == 17) { // capture ctrl key-up
        isCtrl = false;
      }
    };

    document.onkeydown = function (e) {
      if (e.keyCode == 17) { // be sure ctrl is down
        isCtrl = true;
      }
      if (isCtrl && e.keyCode == 83) {
        $scope.saveData();
        return false;
      }
    };


  }

})();