<?php

header('Content-type: application/json');

$API_ENDPOINT 	= 'http://feedwrangler.net/api/v2/';
$CLIENT_KEY		= '09104661d485dd600baa2f74e7a93831';

$ch = curl_init();

$params = $_GET;
$params['client_key'] = $CLIENT_KEY;
	
$load_url = $API_ENDPOINT . $_GET['url'] . '?' . http_build_query($params);

curl_setopt($ch, CURLOPT_URL, $load_url );
curl_setopt($ch, CURLOPT_HEADER, 0 );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );

if(curl_exec($ch) === false)
{
	echo '{"error":"' . curl_error($ch) . '"}';
} else {
	$html = curl_exec($ch);
}


curl_close($ch);

print( $html );

?>