<?php
declare(strict_types=1);

if (file_exists('fullstop.flag') === true) {
    exit('The site have gone into a full stop.');
}

$isOpCacheEnabled = function_exists(function: 'opcache_reset') === true;
if ($isOpCacheEnabled === false) {
    return;
}

opcache_reset();
