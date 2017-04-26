(function () {
  'use strict';

  angular
    .module('krd-redcap')
    .factory('redcapService', redcapService);

  redcapService.$inject = ['$http', '$q'];

  function redcapService($http, $q) {
    var self = this;
    var service = {
      createJsField: jsField,
      retrieveFieldsFromREDCap: retrieveFieldsFromREDCap,
      retrieveFieldsFromUri: retrieveFieldsFromUri,

      // loadMetadataFieldsFromFile: loadMetadataFieldsFromFile,
      loadValuesFromFile: loadValuesFromFile,
      loadFieldValues: loadFieldValues,
      submitData: submitData
    };
    return service;

    //////////////



    /**
     * Constructor for a javascript Field object based on REDCap metadata
     * Creates a field based on REDCap metadata
     * @metadata REDCap metadata
     */
    function jsField(metadata) {
      this.id = metadata.field_name;
      this.type = metadata.field_type;
      this.label = metadata.field_label || "";
      this.field_note = metadata.field_note || "";
      this.options = optionsTranslator(this.type, metadata.select_choices_or_calculations);
    }

    /**
     * Function to retrieve fields from a REDCap project. Uses configuration information in config.py
     *
     * @returns $q promise function with data as an array of fields. Use 'then' logic.
     *
     * e.g.
     *   var rcFields;
     *   retrieveFieldsFromREDCap().then(
     *     // on success
     *     function (data) {
     *       rcFields = data;
     *       initialize();
     *     },
     *     // on failure
     *     function (response) {
     *       console.log(response);
     *     }
     *   )
     */
    function retrieveFieldsFromREDCap() {
      return retrieveFieldsFromUri('rest/redcap-metadata');
    }

    /**
     * Function to retrieve fields from a URI (could be a rest API, e.g. python script). Convenience function of
     * retrieveFieldsFromREDCap provided
     *
     * @returns $q promise function with data as an array of fields. Use 'then' logic.
     *
     * e.g.
     *   var rcFields;
     *   retrieveFieldsFromUri('myREDCapMetadataExportFile').then(
     *     // on success
     *     function (data) {
     *       rcFields = data;
     *       initialize();
     *     },
     *     // on failure
     *     function (response) {
     *       console.log(response);
     *     }
     *   )
     */
    function retrieveFieldsFromUri(uri) {
      return $q(function (resolve, reject) {
        $http.get(uri)
          .then(
            // On success
            function (response) {
              resolve(response.data);
            },
            // On failure
            function (response) {
              reject(response);
            }
          );
      })
    }

    /**
     * Translates a REDCap-style options string into an array of options
     *
     * @param fieldType The type of field
     * @param options_string a REDCap string representation of choices or calculations, e.g. for a checkbox field
     */
    function optionsTranslator(fieldType, options_string) {
      var options = [];

      // Set specific options (json formatted) for data type
      switch (fieldType) {
        case "radio":
        case "checkbox":
          if (!angular.isDefined(options_string)) {
            options_string = "";
          }

          // Pattern: white space then bar then white space
          var pattern = / \| /;

          // Breaks the options into an array of strings with each option
          var optionList = options_string.split(pattern);

          // new pattern: A letter or number or underscore followed by a comma and a space
          pattern = /([a-zA-Z_0-9]+), (.*)/;

          // Run through the options and store each value:label pair
          var i, len, result;
          for (i = 0, len = optionList.length; i < len; i++) {
            result = pattern.exec(optionList[i]);

            if (result.length > 1) {
              options.push(
                {
                  "value": result[1],
                  "label": result[2]
                }
              )
            }
          }
          break;
        case "yesno":
          // Create options list similar to a multiple choice radio
          options = [
            {
              "value": true,
              "label": "yes"
            },
            {
              "value": false,
              "label": "no"
            }
          ];
          break;
        case "truefalse":
          options = [
            {
              "value": true,
              "label": "true"
            },
            {
              "value": false,
              "label": "false"
            }
          ];
          break;
        case "text":
        case "notes":
        default:
          break;
      }

      return options;
    }

    /**
     * Loads fields from a REDCap metadata file, specified by "uri."
     * If successful, will also initialize itself with the loaded metadata.
     * Returns a promise with field data for successful operation.
     *
     * @param uri of the metadata file requested
     * @param form_name the label of the form that should be loaded
     * @returns Can add a promise for return once fields are loaded with data
     */
    function loadMetadataFieldsFromFile(uri, form_name) {
      // set up to return a promise if fields are loaded
      // ref: https://docs.angularjs.org/api/ng/service/$q
      return $q(function (resolve, reject) {
        // Get the data represented by the filename
        $http.get(uri).then(
          // on success
          function (data) {
            self.initialize(data.data, form_name);

            // return the promise represented by resolve, with data
            resolve(data.data);
          },

          // on failure
          function () {
            console.log("failed to load fields from ", uri);

            // return the promise represented by reject
            reject();
          }
        );
      });
    }

    /**
     * Loads field values from a JSON file. Performs $http request to get
     * the uri. If successful, will load the field values into itself.
     *
     * @param uri the URI for the REDCap-formatted JSON file (single record export)
     * @returns promise for whether or not field values were loaded
     */
    function loadValuesFromFile(uri) {
      // set up to return a promise if fields are loaded
      // ref: https://docs.angularjs.org/api/ng/service/$q
      return $q(function (resolve, reject) {
        console.log("Attempting to load from " + uri);
        $http.get(uri).then(
          // on default record found and loaded
          function (data) {
            self.loadFieldValues(data.data[0]);

            resolve();
          },
          // on failure
          function () {
            console.log("Unable to load values from " + fields_filename);

            reject();
          }
        );
      });
    }

    /**
     * Loads values from a REDCap record export
     *
     * @param data is a JSON-formatted REDCap data export
     */
    function loadFieldValues(data) {
      var pattern = /(.+)___(.+)/;

      for (var fn in data) {
        var result = pattern.exec(fn);

        if (result !== null) {
          // looks for items matching the 'fn' pattern
          this.values[fn] = (data[fn] == "1");
        } else {
          if (this.fields.hasOwnProperty(fn) && (this.fields[fn].type === "yesno" || this.fields[fn].type == "truefalse")) {
            this.values[fn] = (data[fn] == "1");
          } else {
            this.values[fn] = data[fn];
          }
        }
      }
    }

    /**
     * Submit data to a REDCap database
     *
     * @param user
     */
    function submitData(data, user) {
      return $q(function (resolve, reject) {
        var params = {
          method: "post",
          url: "/php/saveToREDCap.php",
          data: {
            user: user,
            fields: data
          }
        };

        $http(params).then(
          function (returnData) {
            console.log("Submitted to REDCap: " + returnData);

            $scope.test_data = returnData;
            $scope.dataSubmitted = true;

            resolve();
          },
          function (returnData) {
            console.log("Unable to submit to REDCap: " + returnData);

            reject();
          }
        );

      });
    }

  }
})();