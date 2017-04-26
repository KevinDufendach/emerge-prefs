/**
 * Created by dufendkr on 2/4/2015.
 *
 * the FieldManager is the hub for loading and managing fields. It provides a link that can be used to import
 * fields from REDCap for insertion into files.
 *
 */

function FieldManager($http, $q) {
  "use strict";
  var self = this;

  this.values = {};
  this.fields = {}; // fields open to direct access
  this.isReady = false;

  /////////// Observer ////////////
  this.observers = new ObserverList();

  this.addObserver = function( observer ){
    this.observers.add( observer );
  };

  this.removeObserver = function( observer ){
    this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
  };

  this.notify = function( newValue, oldValue ){
    console.log('fieldManager updating from ' + oldValue + ' to ' + newValue);

    var observerCount = this.observers.count();
    for(var i=0; i < observerCount; i++){
      this.observers.get(i).update( newValue, oldValue );
    }
  };

  /////////// Field MetaData ////////////

  /**
   * Constructor for a Field based on REDCap metadata
   * Creates a field based on REDCap metadata
   */
  function VandAidField(original) {

    this.id = original.field_name;
    this.type = original.field_type;
    this.label = original.field_label || "";
    this.field_note = original.field_note || "";

    // Set specific options (json formatted) for data type
    switch (this.type) {
      case "radio":
      case "checkbox":
        var options_string = original.select_choices_or_calculations || "";

        // Pattern: white space then bar then white space
        var pattern = / \| /;

        // Breaks the options into an array of strings with each option
        var optionList = options_string.split(pattern);

        // new pattern: A letter or number or underscore followed by a comma and a space
        pattern = /([a-zA-Z_0-9]+), (.*)/;

        // create empty options list
        this.options = [];

        // Run through the options and store each value:label pair
        var i, len, result;
        for (i = 0, len = optionList.length; i < len; i++) {
          result = pattern.exec(optionList[i]);

          if (result.length > 1) {
            this.options.push(
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
        this.options = [
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
        this.options = [
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
  }

  VandAidField.prototype.hasValue = function() {
    //TODO: create hasValue function for VandAidField

  };



  /**
   * Loads FieldManager with data from a REDCap formatted JSON file
   *
   * @param jsonREDCapFieldList
   * @param form_name the REDCap form name from which to load fields
   */
  this.initialize = function (jsonREDCapFieldList, form_name) {

    // Parse each entry in the data to create a field
    var i, len;
    for (i = 0, len = jsonREDCapFieldList.length; i < len; i++) {
      if (jsonREDCapFieldList[i].form_name == form_name) { // TODO Allows list of form names
        self.fields[jsonREDCapFieldList[i].field_name] = new VandAidField(jsonREDCapFieldList[i]);
      }
    }

    // Initialize values for each field
    // Values correspond to similar fields for REDCap export, although will
    // use booleans instead of 1's & 0's
    var field;
    for (var fn in self.fields) {
      if (self.fields.hasOwnProperty(fn)) {
        field = self.fields[fn];

        switch (field.type) {
          case "yesno":
          case "truefalse":
//             self.values[field.id] = (field.options[0].value ? "1" : "0");

//             // if (field.options.length < 1) {
//             //   console.log("field " + field.id + " has no options to display.");
//             //   self.values[field.id] = "";
//             //   break;
//             // }
//             // self.values[field.id] = field.options[0].value;
//             break;

          case "radio":
            if (field.options.length < 1) {
              console.log("field " + field.id + " has no options to display.");
              self.values[field.id] = "";
              break;
            }
            self.values[field.id] = field.options[0].value;
            break;
          case "checkbox":
            // Create a fieldId___option1, fieldId___2, etc. value for checkboxes
            for (var j = 0; j < field.options.length; j++) {
              self.values[field.id + "___" + field.options[j].value] = false;
            }
            break;
          case "text":
          case "notes":
          default:
            self.values[field.id] = "";
            break;
        }
      }
    }

    // Notify observers that the fieldManager is ready
    var oldValue = this.isReady;
    this.isReady = true;
    this.notify( this.isReady, oldValue );
  };







  /**
   * Submit data to a REDCap database
   *
   * @param user
   */
  this.saveData = function(data, user) {
    return $q(function(resolve, reject) {
      var params = {
        method: "post",
        url: "/php/saveToJson.php",
        data: {
          user: user,
          fields: data
        }
      };

      $http(params).then(
        function (returnData) {
          console.log("Save to JSON: " + returnData);

          resolve();
        },
        function () {
          console.log("Unable to save to JSON: " + returnData);

          reject();
        }

      );

    });
  };


  /**
   * Converts VandAID fields to a REDCap format
   *
   * @param recordID recordID needed to associate with correct ID
   * @return returns data in a REDCap formatted JSON list
   */
  this.getREDCapFields = function (recordID) {
    var pattern = /(.+)___(.+)/;

    var data = {};

    if (typeof(recordID) != "undefined") {
      data["record_id"] = recordID;
      data["vandaidfields_complete"] = "2";
    }

    for (var fn in this.values) {
      if (!this.values.hasOwnProperty(fn)) continue;

      var result = pattern.exec(fn);

      // For checkboxes, convert back to '1' & '0'
      if (result !== null) {
        data[fn] = (this.values[fn] ? "1" : "0");
      } else if (typeof(this.values[fn]) === "boolean") {
        data[fn] = (this.values[fn] ? "1" : "0");
      } else {
        data[fn] = this.values[fn];
      }
    }

    return data;
  };

  this.getField = function (fieldId) {
    if (this.fields.hasOwnProperty(fieldId)) return this.fields[fieldId];
  };

  this.condition = function(statement) {
    // example: "[age_weight_style] = 'table'",

    var pattern = /\[(.+)]\w*=\w*"(.+)"/;

    // check for pattern
    var result = pattern.exec(statement);
    try {
      return (result !== null && self.getField(result[1]).hasValue(result[2]));
    } catch(err) {
      console.log(err);
      return false;
    }
  };

  this.getCopyOfCurrentValues = function() {
    var result = {};
    for (var fn in this.values) {
      if (!this.values.hasOwnProperty(fn)) continue;
      result[fn] = this.values[fn];
    }

    return result;
  };

  /**
   * Returns true if the data supplied is the same as the current values.
   */
  this.equalsCurrentValues = function(data) {
    for (var fn in this.values) {
      if (!this.values.hasOwnProperty(fn)) continue;

      if (!data.hasOwnProperty(fn) || data[fn] != this.values[fn]) return false;
    }

    return true;
  };

}
