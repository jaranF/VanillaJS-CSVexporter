<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>Form Submitting JSON</title>
  <style>
    textarea { font-family: "Courier New", Courier, sans-serif; font-size: 1em; font-weight: 700; }
  </style>
</head>

<body>
<textarea cols="190" rows="40">
<?php
define('CRLF', chr(10));

    function parseRow($rowData, $isColHeaderRow = false, $bCSVforMSExcel = false)
    {
        $sRowAsCSV = '';
        $i = 0;
        foreach ($rowData as $key => $value) {
            $bEscapeRequired = false;
            if ($isColHeaderRow)
            {

                $value = $key;
            }
            $value = $value === null ? '' : $value; //&& $nullToMysqlNull
            $value = preg_replace_callback(
                    '|"|',
                    function ($matches) {
                       $bEscapeRequired = true;
                       return '""';
                    },
                    $value);

            $sColumnFieldBoundaryQuote = ($bEscapeRequired || $bCSVforMSExcel? '"' : '');
            $sRowAsCSV .= ($i > 0 ? ',' : '') . ($bCSVforMSExcel ? '=' : '') . $sColumnFieldBoundaryQuote . $value . $sColumnFieldBoundaryQuote;
            $i++;
        } //Next $key => $value
        //$sRowAsCSV = rtrim($sRowAsCSV, ',');
        return $sRowAsCSV.CRLF;//$sRowAsCSV;
    }

$json = isset($_POST["data"]) ? $_POST["data"] : '["apple","orange","banana","strawberry"]';
$bMSExcel = isset($_POST["isExcelFormatExport"]) ? $_POST["isExcelFormatExport"] === '1' ? true : false : false;
$ar = json_decode($json, true);
$sCSV = '';
foreach ($ar as $row) {
//    $sCSV = parseRow($row, $sCSV === '');
    if ($sCSV == '')
    {
        $sCSV = parseRow($row, true, $bMSExcel);
    }
    $sCSV .= parseRow($row, false, $bMSExcel);

}
echo $sCSV;
?>
</textarea>
</body>
</html>
