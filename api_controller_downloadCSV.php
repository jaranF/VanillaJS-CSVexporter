<?
header('Cache-Control: public');
header('Content-Description: File Transfer');
header('Content-Disposition: attachment; filename="attendees.csv"');
header('Content-Transfer-Encoding: binary');
header('Content-Type: text/csv; charset=utf-8');
define('CRLF', chr(10));
$sCSV = '';

 //        BTM                FirstName,    LastName
 $sCSV = $sCSV.'BTM 100132173,'.'Sean,'  .  'Damer,'.CRLF;
 $sCSV = $sCSV.'BTM 104462275,'.'Nickolas,'  .  'Antoniades,'.CRLF;
 $sCSV = $sCSV.'BTM 101522545,'.'Sarah,' .  'Lawrence-Taylor,'.CRLF;
 $sCSV = $sCSV.'BTM 100205056,'.'David,' .  ' Jones,'.CRLF;
 $sCSV = $sCSV.'BTM 100132173,'.'Tom,'   .  ' Jones,'.CRLF;
 header('Content-Length: '.strlen(sCSV));
echo $sCSV;
//echo strlen($sCSV);
 ?>
