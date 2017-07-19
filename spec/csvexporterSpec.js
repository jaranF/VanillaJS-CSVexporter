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


  afterEach(function () { //xhr, ENVINFO, JSONData, fileName, bCSVforMSExcel
    delete Function.prototype.reflect;
    app.exportCSV = fnOriginalUnreflectedFunction;
  });
});