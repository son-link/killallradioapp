<?php
include 'xml2json.php';

if ($_GET['url']){
	$xmlNode = simplexml_load_file($_GET['url']);
	$arrayData = xmlToArray($xmlNode);
	//echo json_encode($arrayData);
	echo $_GET['callback'].'('.json_encode($arrayData).')';
}
?>
