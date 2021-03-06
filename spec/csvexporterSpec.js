/*global describe: false, angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, spyOn: false, inject: false, it: false, expect: false, module: false, $rootScope: false, $scope: false, $controller: false, $location: false,  $window: false, $http: false, $location: false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author Jaran F
 */
describe('exportCSV2 (via Inner function exposer)', function () {

  function getPrivateFunctionNames(func) {
    var arrPrivFnNames = [];
    if (typeof func !== "string") {
      func = func.toString();
    }
    var arrFinds = func.match(/.(?:[{}]?([\ ])*function\s+)[^\(]+(?=\()/g);
    var i = 0, sFnName;
    while (i < arrFinds.length) {
      sFnName = arrFinds[i].match(/\S*$/gi)[0];
      arrPrivFnNames.push(sFnName);
      i += 1;
    }
    return arrPrivFnNames;
  } //end 'getPrivateFunctions()'
  function exposePrivateFunctions(func) {
    var sFn = func.toString();
    var arrPrivateFnNames = getPrivateFunctionNames(sFn);
    if (arrPrivateFnNames.length === 0) {
      return;
    }
    var sIntrospectionObj = "", iLen = arrPrivateFnNames.length, i = 0;
    while (i < iLen) { //creates a string based on function names
      sIntrospectionObj += i === 0 ? "\'" : ",\'";
      sIntrospectionObj += arrPrivateFnNames[i] + "\':" + arrPrivateFnNames[i];
      i += 1;        //so exits loop with a string something like "\'
    }
    //next i

    var introspectionEvalHook = arrPrivateFnNames[0] + ".reflect({" + sIntrospectionObj + "});";
    return eval("func = " + sFn.replace(/\{/, "{eval(\"" + introspectionEvalHook + "\");"));
    //eval( dummyArr[0] + ".reflect({\'" + dummyArr[0] + "\':" + dummyArr[0] + ", \'" + dummyArr[1] + "\':" + dummyArr[1] + ", \'" + dummyArr[2] + "\':" + dummyArr[2] + ", \'" + dummyArr[3] + "\':" + dummyArr[3] + " })");
  } //end 'exposePrivateFunctions()'



  var CRLF = String.fromCharCode(13) + String.fromCharCode(10);
  var fnOriginalUnreflectedFunction = null;
  var xhr = {};
  var  ENVINFO = {
    browser: { isIE: false, isSafari: false, isChrome: true }
  }
  beforeEach(function () {
    if (fnOriginalUnreflectedFunction === null) {
      fnOriginalUnreflectedFunction = app.exportCSV;
    }
    Function.prototype.reflect = function (reflectionDefinition) {
      Function.prototype.reflect = reflectionDefinition;
    }; //End 'reflect()'
    //var arrPrivFuncs = getPrivateFunctions(LTA.Init);
    //var arr = LTA.Init.toString().match(/(?:[ \t}]? function\s+)[^\(]+(?=\()/g)

  });

  it("should serialize an array passed into it (via \'inner'...private scope function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false); //Reqd to make the reflection of the inner...private scope function to take place.
    var mockRowAsArray = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS", "BTM_NUMBER", "BOOKING_METHOD", "ELIGIBLE", "NOTES"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("FIRST_NAME,LAST_NAME,EMAIL_ADDRESS,BTM_NUMBER,BOOKING_METHOD,ELIGIBLE,NOTES" + CRLF);
  });


  it("should serialize an object passed into it (via \'inner'...private scope function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false);
    var mockRowAsObj = {
      OBJECTFIELDNAME1: "FIRST_NAME",
      OBJECTFIELDNAME2: "LAST_NAME",
      OBJECTFIELDNAME3: "EMAIL_ADDRESS",
      OBJECTFIELDNAME4: "BTM_NUMBER",
      OBJECTFIELDNAME5: "BOOKING_METHOD",
      OBJECTFIELDNAME6: "ELIGIBLE",
      OBJECTFIELDNAME7: "NOTES"
    };
    var result = app.exportCSV.reflect["parseRow"](mockRowAsObj);
    expect(result).toEqual("FIRST_NAME,LAST_NAME,EMAIL_ADDRESS,BTM_NUMBER,BOOKING_METHOD,ELIGIBLE,NOTES" + CRLF);
  });

  it("should escape embedded double-quotes in data as it serializes an array (via \'inner\' function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false);
    var mockRowAsArray = ["FIRST_NAME", "LAST_NAME", "YE_OLDE_\"ELECTRONIC\"_MAIL_ADDRESS", "BTM_NUMBER", "BOOKING_METHOD", "ELIGIBLE", "NOTES"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("FIRST_NAME,LAST_NAME,\"YE_OLDE_\"\"ELECTRONIC\"\"_MAIL_ADDRESS\",BTM_NUMBER,BOOKING_METHOD,ELIGIBLE,NOTES" + CRLF);
    //toEqual =             FIRST_NAME,LAST_NAME,"YE_OLDE_""ELECTRONIC""_MAIL_ADDRESS",BTM_NUMBER,BOOKING_METHOD,ELIGIBLE,NOTES
  });

  it("should escape embedded double-quotes in data as it serializes an object (via \'inner\' function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false);
    var mockRowAsObj = {
      OBJECTFIELDNAME1: "FIRST_NAME",
      OBJECTFIELDNAME2: "LAST_NAME",
      OBJECTFIELDNAME3: "EMAIL_ADDRESS",
      OBJECTFIELDNAME4: "\"BTM\"_NUMBER",
      OBJECTFIELDNAME5: "BOOKING_METHOD",
      OBJECTFIELDNAME6: "ELIGIBLE",
      OBJECTFIELDNAME7: "NOTES"
    };
    var result = app.exportCSV.reflect["parseRow"](mockRowAsObj);
    expect(result).toEqual("FIRST_NAME,LAST_NAME,EMAIL_ADDRESS,\"\"\"BTM\"\"_NUMBER\",BOOKING_METHOD,ELIGIBLE,NOTES" + CRLF);
  });

  it("should serialize (in MS Excel CSV format) an array passed into it (via \'inner'...private scope function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", true); //true means serialize to a MS Excel flavoured variant of CSV
    var mockRowAsArray = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS", "BTM_NUMBER", "BOOKING_METHOD", "ELIGIBLE", "NOTES"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("=\"FIRST_NAME\",=\"LAST_NAME\",=\"EMAIL_ADDRESS\",=\"BTM_NUMBER\",=\"BOOKING_METHOD\",=\"ELIGIBLE\",=\"NOTES\"" + CRLF);
    //                       ="FIRST_NAME",="LAST_NAME",="EMAIL_ADDRESS",="BTM_NUMBER",="BOOKING_METHOD",="ELIGIBLE",="NOTES"
  });

  it("should serialize (in MS Excel CSV format) an object passed into it (via \'inner'...private scope function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", true); //true means serialize to a MS Excel flavoured variant of CSV
    var mockRowAsObj = {
      OBJECTFIELDNAME1: "FIRST_NAME",
      OBJECTFIELDNAME2: "LAST_NAME",
      OBJECTFIELDNAME3: "EMAIL_ADDRESS",
      OBJECTFIELDNAME4: "BTM_NUMBER",
      OBJECTFIELDNAME5: "BOOKING_METHOD",
      OBJECTFIELDNAME6: "ELIGIBLE",
      OBJECTFIELDNAME7: "NOTES"
    };
    var result = app.exportCSV.reflect["parseRow"](mockRowAsObj);
    expect(result).toEqual("=\"FIRST_NAME\",=\"LAST_NAME\",=\"EMAIL_ADDRESS\",=\"BTM_NUMBER\",=\"BOOKING_METHOD\",=\"ELIGIBLE\",=\"NOTES\"" + CRLF);
  });

  it("should escape embedded double-quotes in data as it serializes (in MS Excel CSV format) an array (via \'inner\' function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", true); //true means serialize to a MS Excel flavoured variant of CSV
    var mockRowAsArray = ["FIRST_NAME", "LAST_NAME", "YE_OLDE_\"ELECTRONIC\"_MAIL_ADDRESS", "BTM_NUMBER", "BOOKING_METHOD", "ELIGIBLE", "NOTES"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("=\"FIRST_NAME\",=\"LAST_NAME\",=\"YE_OLDE_\"\"ELECTRONIC\"\"_MAIL_ADDRESS\",=\"BTM_NUMBER\",=\"BOOKING_METHOD\",=\"ELIGIBLE\",=\"NOTES\"" + CRLF);
    //toEqual =             ="FIRST_NAME",=\"="LAST_NAME",="YE_OLDE_""ELECTRONIC""_MAIL_ADDRESS",="BTM_NUMBER",="BOOKING_METHOD",="ELIGIBLE",="NOTES"
  });

  it("should escape embedded double-quotes in data as it serializes (in MS Excel CSV format) an object (via \'inner\' function \'parseRow()\')", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", true); //true means serialize to a MS Excel flavoured variant of CSV
    var mockRowAsObj = {
      OBJECTFIELDNAME1: "FIRST_NAME",
      OBJECTFIELDNAME2: "LAST_NAME",
      OBJECTFIELDNAME3: "EMAIL_ADDRESS",
      OBJECTFIELDNAME4: "\"BTM\"_NUMBER",
      OBJECTFIELDNAME5: "BOOKING_METHOD",
      OBJECTFIELDNAME6: "ELIGIBLE",
      OBJECTFIELDNAME7: "NOTES"
    };
    var result = app.exportCSV.reflect["parseRow"](mockRowAsObj);
    expect(result).toEqual("=\"FIRST_NAME\",=\"LAST_NAME\",=\"EMAIL_ADDRESS\",=\"\"\"BTM\"\"_NUMBER\",=\"BOOKING_METHOD\",=\"ELIGIBLE\",=\"NOTES\"" + CRLF);
  });

  it("should gracefully handle situations where a field value in a column is empty", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false);
    var mockRowAsArray = ["Breakfast", "", "Dinner"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("Breakfast,,Dinner" + CRLF);
    mockRowAsArray = ["", "Lunch", "Dinner"];
    result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual(",Lunch,Dinner" + CRLF);
    mockRowAsArray = ["Breakfast", "Lunch", ""];
    result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("Breakfast,Lunch," + CRLF);
  });

  it("should gracefully handle null values in data and replace them with an empty strings", function () {
    app.exportCSV = exposePrivateFunctions(app.exportCSV);
    app.exportCSV('[{"0":"0"}]', "", false);
    var mockRowAsArray = ["Breakfast", null, "Dinner"];
    var result = app.exportCSV.reflect["parseRow"](mockRowAsArray);
    expect(result).toEqual("Breakfast,,Dinner" + CRLF);
  });


  describe ("exportCSV Exporter Integration Test (including browser mocks)", function() {
    it("should serialize an entire JSON object (i.e. integration test of RFC-4180 CSV format) passed into it and put fieldname labels at the start as a header row", function () {
      var mockJSONData = [{
        "FIRST_NAME": "catherine",
        "LAST_NAME": "\"The Booze\" Cruse",
        "EMAIL_ADDRESS": "ccruse60@gmail.com",
        "BTM_NUMBER": 106057075,
        "BOOKING_METHOD": "Online",
        "ELIGIBLE": "Yes",
        "NOTES": ""
      },
        {
          "FIRST_NAME": "Fred",
          "LAST_NAME": "West",
          "EMAIL_ADDRESS": "fwest1961@gmail.com",
          "BTM_NUMBER": 106253272,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Aikdo",
          "LAST_NAME": "Fushjuitsma",
          "EMAIL_ADDRESS": "AikdoFushjuitsma@gmail.com",
          "BTM_NUMBER": 105769990,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Alexandra",
          "LAST_NAME": "Masonry",
          "EMAIL_ADDRESS": "Alexandra.Masonry@roehampton.ac.uk",
          "BTM_NUMBER": 101420560,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Costas",
          "LAST_NAME": "Boufontostremondos",
          "EMAIL_ADDRESS": "waterfallsbytlc@gmail.com",
          "BTM_NUMBER": 107034189,
          "BOOKING_METHOD": "Online",
          "ELIGIBLE": "Yes",
          "NOTES": null
        }
      ];
      var result = app.exportCSV(mockJSONData, "", false); //false means serialize to standard RFC-4180 format NOT quirky the MS Excel flavoured variant of CSV
      var expected = "FIRST_NAME,LAST_NAME,EMAIL_ADDRESS,BTM_NUMBER,BOOKING_METHOD,ELIGIBLE,NOTES" + CRLF +
          "catherine,\"\"\"The Booze\"\" Cruse\",ccruse60@gmail.com,106057075,Online,Yes," + CRLF +
          "Fred,West,fwest1961@gmail.com,106253272,Manual,Yes," + CRLF +
          "Aikdo,Fushjuitsma,AikdoFushjuitsma@gmail.com,105769990,Manual,Yes," + CRLF +
          "Alexandra,Masonry,Alexandra.Masonry@roehampton.ac.uk,101420560,Manual,Yes," + CRLF +
          "Costas,Boufontostremondos,waterfallsbytlc@gmail.com,107034189,Online,Yes," + CRLF;

      expect(result).toEqual(expected);
    });
    it("should serialize an entire JSON object (i.e. integration test of MS Excel CSV format) passed into it and put fieldname labels at the start as a header row", function () {
      var mockJSONData = [{
        "FIRST_NAME": "catherine",
        "LAST_NAME": "\"The Booze\" Cruse",
        "EMAIL_ADDRESS": "ccruse60@gmail.com",
        "BTM_NUMBER": 106057075,
        "BOOKING_METHOD": "Online",
        "ELIGIBLE": "Yes",
        "NOTES": ""
      },
        {
          "FIRST_NAME": "Fred",
          "LAST_NAME": "West",
          "EMAIL_ADDRESS": "fwest1961@gmail.com",
          "BTM_NUMBER": 106253272,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Aikdo",
          "LAST_NAME": "Fushjuitsma",
          "EMAIL_ADDRESS": "AikdoFushjuitsma@gmail.com",
          "BTM_NUMBER": 105769990,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Alexandra",
          "LAST_NAME": "Masonry",
          "EMAIL_ADDRESS": "Alexandra.Masonry@roehampton.ac.uk",
          "BTM_NUMBER": 101420560,
          "BOOKING_METHOD": "Manual",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
        {
          "FIRST_NAME": "Costas",
          "LAST_NAME": "Boufontostremondos",
          "EMAIL_ADDRESS": "waterfallsbytlc@gmail.com",
          "BTM_NUMBER": 107034189,
          "BOOKING_METHOD": "Online",
          "ELIGIBLE": "Yes",
          "NOTES": null
        }
      ];
      var result = app.exportCSV(mockJSONData, "", true); //false means serialize to standard RFC-4180 format NOT quirky the MS Excel flavoured variant of CSV
      var expected = "=\"FIRST_NAME\",=\"LAST_NAME\",=\"EMAIL_ADDRESS\",=\"BTM_NUMBER\",=\"BOOKING_METHOD\",=\"ELIGIBLE\",=\"NOTES\"" + CRLF +
          "=\"catherine\",=\"\"\"The Booze\"\" Cruse\",=\"ccruse60@gmail.com\",=\"106057075\",=\"Online\",=\"Yes\",=\"\"" + CRLF +
          "=\"Fred\",=\"West\",=\"fwest1961@gmail.com\",=\"106253272\",=\"Manual\",=\"Yes\",=\"\"" + CRLF +
          "=\"Aikdo\",=\"Fushjuitsma\",=\"AikdoFushjuitsma@gmail.com\",=\"105769990\",=\"Manual\",=\"Yes\",=\"\"" + CRLF +
          "=\"Alexandra\",=\"Masonry\",=\"Alexandra.Masonry@roehampton.ac.uk\",=\"101420560\",=\"Manual\",=\"Yes\",=\"\"" + CRLF +
          "=\"Costas\",=\"Boufontostremondos\",=\"waterfallsbytlc@gmail.com\",=\"107034189\",=\"Online\",=\"Yes\",=\"\"" + CRLF;

      expect(result).toEqual(expected);
    });
    describe ("exportCSV With Mock for Safari Browser Test", function() {
      it("should - if browser is Safari < version 15.0 - use a server-side fallback when serializing an entire JSON object (RFC-4180 CSV format) ", function() {
        var mockJSONData = [{
          "FIRST_NAME": "catherine",
          "LAST_NAME": "\"The Booze\" Cruse",
          "EMAIL_ADDRESS": "ccruse60@gmail.com",
          "BTM_NUMBER": 106057075,
          "BOOKING_METHOD": "Online",
          "ELIGIBLE": "Yes",
          "NOTES": ""
        },
          {
            "FIRST_NAME": "Fred",
            "LAST_NAME": "West",
            "EMAIL_ADDRESS": "fwest1961@gmail.com",
            "BTM_NUMBER": 106253272,
            "BOOKING_METHOD": "Manual",
            "ELIGIBLE": "Yes",
            "NOTES": ""
          },
          {
            "FIRST_NAME": "Aikdo",
            "LAST_NAME": "Fushjuitsma",
            "EMAIL_ADDRESS": "AikdoFushjuitsma@gmail.com",
            "BTM_NUMBER": 105769990,
            "BOOKING_METHOD": "Manual",
            "ELIGIBLE": "Yes",
            "NOTES": ""
          },
          {
            "FIRST_NAME": "Alexandra",
            "LAST_NAME": "Masonry",
            "EMAIL_ADDRESS": "Alexandra.Masonry@roehampton.ac.uk",
            "BTM_NUMBER": 101420560,
            "BOOKING_METHOD": "Manual",
            "ELIGIBLE": "Yes",
            "NOTES": ""
          },
          {
            "FIRST_NAME": "Costas",
            "LAST_NAME": "Boufontostremondos",
            "EMAIL_ADDRESS": "waterfallsbytlc@gmail.com",
            "BTM_NUMBER": 107034189,
            "BOOKING_METHOD": "Online",
            "ELIGIBLE": "Yes",
            "NOTES": null
          }
        ];

        var mock = {
          ENVINFO: {
            browser: {
              isIE: false,
              isSafari: false,
              version: 10
            }
          }
        };

        function safariFallback() {
          return void(0);
        } //end fn safariDownloadfallback

        var fnSafariDownloadfallback = {
          safariDownloadFallback:  safariFallback
        };

        spyOn(fnSafariDownloadfallback, 'safariDownloadFallback');

        app.exportCSV.inject([mock, fnSafariDownloadfallback]).andExecuteWith(mockJSONData, "", false);
        expect(fnSafariDownloadfallback.safariDownloadFallback).not.toHaveBeenCalled();

        mock.ENVINFO.browser.isSafari = true;
        app.exportCSV.inject([mock, fnSafariDownloadfallback]).andExecuteWith(mockJSONData, "", false);
        expect(fnSafariDownloadfallback.safariDownloadFallback).toHaveBeenCalled();

      })

    }); //End integration tests

  }); //End integration tests

  afterEach(function () {
    delete Function.prototype.reflect;
    app.exportCSV = fnOriginalUnreflectedFunction;
  });
});