<?php
define('CRLF', chr(10));
$filename = isset($_POST["filenameString"]) ? $_POST["filenameString"] : 'filename';
header('Cache-Control: public');
header('Content-Description: File Transfer');
header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
header('Content-Transfer-Encoding: binary');
header('Content-Type: text/csv; charset=utf-8');

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
    if ($sCSV == '')
    {
        $sCSV = parseRow($row, true, $bMSExcel);
    }
    $sCSV .= parseRow($row, false, $bMSExcel);

}
 header('Content-Length: '.strlen(sCSV));
echo $sCSV;
?>
