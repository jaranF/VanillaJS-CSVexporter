<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>Form Submitting JSON</title>
</head>

<body>
<?php
  echo isset($_POST["isExcelFormat"]) ? 'true' : 'false';
?>
<hr>
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
$bMSExcel = isset($_POST["isExcelFormat"]) ? $_POST["isExcelFormat"] === 'Yes' ? true : false : false;
$ar = json_decode($json,true);
$sCSV = '';
foreach ($ar as $row) {
//    $sCVS = parseRow($row, $sCVS === '');
    if ($sCVS == '')
    {
        $sCVS = parseRow($row, true, $bMSExcel);
    }
    $sCVS .= parseRow($row, false, $bMSExcel);

}
echo $sCVS;
?>
</textarea>
</body>
</html>
