window.onload = function() {
  var d = document, eleForm = d.getElementById("jsonPOSTform");

  function pickUpJSONandConvert() {
    var objJSON = JSON.parse(d.getElementById("data").value);
    var sfileName = d.getElementById("filenameString").value;
    var isExcelFormat = !!(eleForm.elements["isExcelFormatExport"].value - 0)
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

  } //End #pickUpJSONandConvert()'
  if (window.attachEvent) {
    eleForm.attachEvent("onsubmit", pickUpJSONandConvert);
  } else {
    eleForm.addEventListener("submit", function(evt) {
      pickUpJSONandConvert();
      evt.preventDefault();
      return false;
    });
  }
};