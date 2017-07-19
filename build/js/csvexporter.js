var app = app || {};

(function(ns) {
  ns.exportCSV = function (JSONData, fileName, bCSVforMSExcel) {
    var CRLF = String.fromCharCode(13) + String.fromCharCode(10); //Carriage Return + Line Feed
    var sSerializedToCsv = "";
    var __browser = this.__ENVINFO ? this.__ENVINFO.browser : {};
    bCSVforMSExcel = bCSVforMSExcel !== undefined ? bCSVforMSExcel : false;

    function parseRow(rowData) {
      var sRow = "";
      var regExpDblQuoteEscape = new RegExp('\"',"g");
      for (var iO in rowData) {
        var value = rowData[iO];
        var bEscapeRequired = false;
        var sColumnFieldBoundaryQuote;
        value = value === null ? "" : value;
        if (typeof value === "string") {
          value = value.replace(regExpDblQuoteEscape,
              function () {
                bEscapeRequired = true;
                return "\"\"";
              });
        }
        sColumnFieldBoundaryQuote = (bEscapeRequired || bCSVforMSExcel? "\"" : "")
        sRow += (bCSVforMSExcel ? "=" : "") + sColumnFieldBoundaryQuote + value + sColumnFieldBoundaryQuote + ",";
      }
      sRow = sRow.substring(0, sRow.length - 1) + CRLF; //Strip off last "," and append end-of-row marker
      return sRow;
    } //End parseRow

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    sSerializedToCsv = parseRow(Object.keys(arrData[0])); //First CVS-erize the column headings
    arrData.forEach(function(value) { //val, index, array
      sSerializedToCsv += parseRow(value);
    });
    if (__browser.isIE) {
      var IEwindow = window.open("", "", "width=0, height=0, location=no, menubar=no, resizable=no, titlebar=no, status=no, scrollbars=no, visible=none");
      IEwindow.document.write('sep=,\r\n' +CSV);
      IEwindow.document.close();
      IEwindow.document.execCommand('SaveAs', true, fileName + ".xls");
      IEwindow.close();
    }
    else if (__browser.isSafari && __browser.version < 15) { //Rely on the server to provide our CSV as opposed to being able to do it client-side
      this.__safariDownloadFallback();
    } else {
      var a = document.createElement('a');
      var sMimeString = bCSVforMSExcel ? "application/vnd.ms-excel" : "text/csv";
      var blob = new Blob([sSerializedToCsv], {
        'type': sMimeString
      });

      a.href = window.URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.download = (fileName + ".csv");
      a.click();
    }
    return sSerializedToCsv;

  }; //end 'ns.exportCSV()'

  //function doCSVexport() {
  //  var d = document;
  //  var JSONdata = d.getElementById("data").innerHTML;
  //  var sfileName = d.getElementById("filenameString").value;
  //  var isExcelFormat = !!(d.forms["jsonCSVexporter"].elements["isExcelFormatExport"].value - 0)
  //  var result = app.exportCSV.inject(app, [xhr, ENVINFO]).andExecuteWith(JSONdata, sfileName, isExcelFormat );
  //  document.getElementById("data").innerHTML = result;
  //}
  //ns.doCSVexport = doCSVexport;

})(app);