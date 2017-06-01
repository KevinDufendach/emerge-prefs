(function () {
  'use strict';

  angular
    .module('krd-redcap')
    .factory('redcapService', redcapService);

  redcapService.$inject = ['$http', '$q', '$log'];

  function redcapService($http, $q, $log) {
    var self = this;

    var idCount = 0;

    var service = {
      fieldConstructor: vandaidField,
      getInitialValue: getInitialValue,
      retrieveFieldsFromREDCap: retrieveFieldsFromREDCap,
      retrieveFieldsFromUri: retrieveFieldsFromUri,
      addFieldValue: addFieldValue,
      getVandAIDStyleFieldValue: getVandAIDStyleFieldValue,
      updateToVandAIDStyleFieldValues: updateToVandAIDStyleFieldValues,

      // loadMetadataFieldsFromFile: loadMetadataFieldsFromFile,
      loadValuesFromFile: loadValuesFromFile,
      loadFieldValues: loadFieldValues,
      submitData: submitData,
      loadData: loadData
    };
    return service;

    //////////////

    /**
     * Constructor for a javascript Field object based on REDCap metadata
     * Creates a field based on REDCap metadata
     * @metadata REDCap metadata
     */
    function vandaidField(metadata) {
      this.order = idCount++;
      this.id = metadata.field_name.toLowerCase();
      this.type = metadata.field_type;
      this.label = metadata.field_label;
      this.field_note = metadata.field_note;
      this.branching_logic = metadata.branching_logic;
      this.options = optionsTranslator(this.type, metadata.select_choices_or_calculations);
    }

    /**
     * Create a JavaScript-style value object (e.g. yes/no or true/false translated to T/F)
     */
    function getInitialValue(field, index) {
      var value = '';

      switch (field.type) {
        case "yesno":
        case "truefalse":
          value = false;
          break;
        case "radio":
          if (field.options.length < 1) {
            console.log("field " + field.id + " has no options to display.");
            value = '';
          } else {
            value = field.options[0].value;
          }
          break;
        case 'checkbox':
          if (!angular.isDefined(index)) {
            $log.log('No index specified for field: ' + field.id + '. Returning default value of false');
            value = false;
            break;
          }

          value = false;
          break;
        case "text":
        case "notes":
          value = '';
          break;
      }

      return value;
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
    function retrieveFieldsFromREDCap(formName) {
      return retrieveFieldsFromUri('/rest/redcap-metadata', formName);
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
    function retrieveFieldsFromUri(uri, formName) {
      return $q(function (resolve, reject) {
        $http.post(uri)
          .then(
            // On success
            function (response) {
              // ToDo: reject if error retrieving data or not formatted correctly

              // Limit to specific form name
              if (formName) {
                var result = [];
                for (var i = 0; i < response.data.length; i++) {
                  if (response.data[i].form_name === formName) {
                    result.push(response.data[i]);
                  }
                }

                removeRecordID(result);

                resolve(result);
              } else {
                removeRecordID(response.data);
                resolve(response.data);
              }
            },
            // On failure
            function (response) {
              reject(response);
            }
          );
      });

      function removeRecordID(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].field_name === 'record_id') {
            return data.splice(i, 1);
          }
        }
      }
    }

    /**
     * Translates a REDCap-style options into parsable
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
                  "value": result[1].toLowerCase(),
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
          if (this.fields.hasOwnProperty(fn) && (this.fields[fn].type === "yesno" || this.fields[fn].type === "truefalse")) {
            this.values[fn] = (data[fn] == "1");
          } else {
            this.values[fn] = data[fn];
          }
        }
      }
    }

    /**
     * Takes a list of values and optional fields and converts them to VandAID style fields as defined by field type or
     * via pattern recognition of checkbox values
     *
     * @param values
     * @param fields
     */
    function updateToVandAIDStyleFieldValues(values, fields) {
      var pattern = /(.+)___(.+)/;

      angular.forEach(values, function(val, key) {
        var result = pattern.exec(key);

        // looks for items matching the 'key' pattern
        if (result !== null) {
          // If matches, use the 'checkbox' type
          values[key] = getVandAIDStyleFieldValue('checkbox', val);
        } else {
          // If no match, try to discover the field type in the list of fields (if it exists)
          if (angular.isDefined(fields[key])) {
            values[key] = getVandAIDStyleFieldValue(fields[key].type, val);
          }
        }
      });

    }

    function getVandAIDStyleFieldValue(fieldType, value) {
      // Set specific options (json formatted) for data type
      switch (fieldType) {
        case "checkbox":
        case "yesno":
        case "truefalse":
          return ((typeof(value) === "boolean" && value) || value === "1");
        case "radio":
        case "text":
        case "notes":
        default:
          return value || "";
      }
    }

    function translateToREDCapStyleFields(values) {
//       var data = angular.copy(values);
      var data = {};

      angular.forEach(values, function (val, key) {
        if (typeof(val) === "boolean") {
          if (val) {
            data[key.toLowerCase()] = "1";
          }  else {
            data[key.toLowerCase()] = "0";
          }
        } else {
          data[key.toLowerCase()] = val;
        }
      });

      return data;
    }

    /**
     * Submit data to a REDCap database
     *
     * @param user
     */
    function submitData(user, values) {
      return $q(function (resolve, reject) {
        if (!values) {
          reject('No data given');
        }

        if (!user ||
          !(angular.isDefined(user.id) && angular.isDefined(user.key)) ||
          user.id === "" ||
          user.key === "") {
          $log.log("No user defined");

          reject('No user specified');
          return;
        }

        var data = translateToREDCapStyleFields(values);
        data['record_id'] = user.id;

        var params = {
          method: "post",
          url: "/rest/redcap-import-records",
          data: {
            user: user,
            fields: data
          }
        };

        $http(params).then(
          function (returnData) {
            $log.log("Submitted to REDCap: " + returnData.data.count);

            if (returnData.data.count === 1) {
              resolve(returnData);
            } else {
              reject("Unable to submit to REDCap: " + returnData.data);
            }
          },
          function (returnData) {
            $log.log("Unable to reach REDCap: " + returnData.statusText);

            reject("Unable to reach REDCap: " + returnData.statusText);
          }
        );

      });
    }

    /**
     * Load data from a REDCap record export
     *
     * @param user
     */
    function loadData(user, formName) {
      $log.log("Attempting to load data");

      return $q(function (resolve, reject) {
        if (!formName) {
          reject('Unable to load data: No form name given');
        }

        if (!user ||
          !(angular.isDefined(user.id) && angular.isDefined(user.key)) ||
          user.id === "" ||
          user.key === "") {
          $log.log("No user defined");

          reject('No user specified');
          return;
        }

        // data['record_id'] = user.id;

        var params = {
          method: "post",
          url: "/rest/redcap-export-records",
          data: {
            user: user,
            formName: formName
          }
        };

        $http(params).then(
          // On success
          function (returnData) {
            $log.log('Successfully retrieved from REDCap');

            if (returnData.data.length === 1) {
              resolve(returnData.data[0]);
            } else {
              reject("REDCap service data was non-zero length: " + returnData.data);
            }
          },
          // $http fail callback
          function (returnData) {
            $log.log("Unable to reach REDCap: " + returnData.statusText);

            reject("Unable to reach REDCap: " + returnData.statusText);
          }
        );

      });
    }

    /**
     * Adds values from given field to specified values object. Optionally overwrites the current value
     *
     * @param field
     * @param valuesObject
     * @param overwrite
     */
    function addFieldValue(field, valuesObject, overwrite) {
      var valueKey = '';
      if (field.type === "checkbox") {
        for (var i = 0; i < field.options.length; i++) {
          valueKey = (field.id + '___' + field.options[i].value);

          if (overwrite || !angular.isDefined(valuesObject[valueKey])) {
            valuesObject[valueKey] = getInitialValue(field, i);
          }
        }
      } else {
        valueKey = field.id;

        if (overwrite || !angular.isDefined(valuesObject[valueKey])) {
          valuesObject[field.id] = getInitialValue(field);
        }
      }
    }
  }
})();