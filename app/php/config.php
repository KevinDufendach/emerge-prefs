<?php

// API key from REDCap project
$GLOBALS['api_token'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456';

// use local REDCap server
$GLOBALS['api_url'] = 'https://redcap.vanderbilt.edu/api/';

// obtain CERT for the REDCap server, e.g. https://redcap.vanderbilt.edu
$GLOBALS['ca_cert'] = getcwd() . "/CAcerts/GeoTrustGlobalCA.crt";
