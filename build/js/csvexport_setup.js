/*global angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, andExecuteWith: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false, app: false, exportCSV: false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author Jaran F
 * @description To demonstrate the 'CSVexport.js' functionality there the need for convenience in having 'pre-baked' sample JSON data that can be reviewed (in this case because it is in a <TEXTAREA> element) and picked up from DOM before it is converted to CSV. 
 */
window.onload = function() {
  var d = document, eleForm = d.getElementById("jsonPOSTform");

  function pickUpJSONandConvert() {
    var objJSON = JSON.parse(d.getElementById("data").value);
    var sfileName = d.getElementById("filenameString").value;
    var isExcelFormat = !!(eleForm.elements["isExcelFormatExport"].value - 0);
    var mock = {
      ENVINFO: {
        browser: {
          isIE: false,
          isSafari: true,
          version: 10
        }
      }
    };
    function safariFallback() {
      var d = document, eleResult = d.getElementById("result"),
          eleIframe = document.getElementById("tempSafariDownloadFrame");

      if (eleIframe === null) {
        eleIframe = d.createElement("IFRAME");
        eleIframe.setAttribute("style", "display: none;");
        eleIframe.setAttribute("name", "tempSafariDownloadFrame");
        eleIframe.setAttribute("id", "tempSafariDownloadFrame");
        eleIframe.setAttribute("sandbox", "allow-forms");
        eleIframe.setAttribute("sandbox", "allow-scripts");
        eleIframe.setAttribute("height", "1");
        eleIframe.setAttribute("width", "1");
        eleResult.appendChild(eleIframe);
      }
      eleForm.setAttribute("target", "tempSafariDownloadFrame");
      eleForm.setAttribute("action", "json_decode_and_download.php");
      eleForm.submit();
    } //end fn safariDownloadfallback
    var fnSafariDownloadfallback = {
      safariDownloadFallback:  safariFallback
    };
    var sConvertedToCSV = app.exportCSV.inject([mock, fnSafariDownloadfallback]).andExecuteWith(objJSON, sfileName, isExcelFormat);
    d.getElementById("csv").value = sConvertedToCSV;
    return sConvertedToCSV;
  } //End #pickUpJSONandConvert()'
  if (window.attachEvent) {
    eleForm.attachEvent("onsubmit", function(evt) {
      evt = evt || window.event;
      pickUpJSONandConvert();
      evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    });


  } else {
    eleForm.addEventListener("submit", function(evt) {
      pickUpJSONandConvert();
      evt.preventDefault();
      return false;
    });
  }
};
