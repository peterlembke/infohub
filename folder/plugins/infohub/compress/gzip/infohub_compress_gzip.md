# Infohub Compress Gzip

Compress and decompress data with gzip.

# Gzip compression

I want to use gzip compression on the js client to store data in Storage and localStorage. I also want gzip to be used
in tre traffic between client <> server. And on the server I want gzip to be used when storing data in Storage.

# Gzip library

Gzip is part of Zlib. Zlib is built into PHP. There is also a Zlib implementation in Javascript. This is the one I have
used.
https://github.com/imaya/zlib.js/blob/develop/test/browser/gzip-test.js

Zlib is not built into the browser.

# Implementation in PHP

PHP has a built-in function `gzencode()`, `gzdecode()` that are used in the plugin.

# Implementation in Javascript

Javascript have ZERO commands of any compression algorithms. That could have been in the browser. All implementations
are done in Javascript-code instead.  
The Gzip implementation come
from <a href="https://github.com/imaya/zlib.js/blob/develop/test/browser/gzip-test.js" target="_blank">Imaya Zlib on
GitHub</a>, written by author <a href="https://github.com/imaya" target="_blank">Imaya Yuta</a>.  
License. Copyright © 2012 imaya. Licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT
License</a>.  
The code is then part of plugin infohub_compress_gzip.js

## More information

The Zlib on PHP have different versions of gzip.  
gzcompress(), gzencode(), gzdeflate().

* https://trog.qgl.org/20110725/php-compression-gzcompress-vs-gzdeflate-vs-gzencode/
* https://stackoverflow.com/questions/621976/which-compression-method-to-use-in-php

# Testing

* PHP compress PHP decompress - OK. Original: 3591, Compressed: 2225, Decompressed: 3591
* JS compress JS decompress - OK. Original: 3591, Compressed: 2296, Decompressed: 3591
* PHP compress JS decompress - OK. Original: 3591, Compressed: 2256, Decompressed: 3591
* JS compress PHP decompress - OK. Original: 3591, Compressed: 2296, Decompressed: 3591

## JS compress JS decompress

This works well. I can compress a UTF-8 string, get a compressed binary base64 back. I can decompress the binary base64
string into a UTF-8 string.

## PHP compress PHP decompress

This works well. I can compress a UTF-8 string, get a compressed binary base64 back. I can decompress the binary base64
string into a UTF-8 string.

## PHP compress JS decompress

This works well. I can compress a UTF-8 string, get a compressed binary base64 back. I can decompress the binary base64
string into a UTF-8 string.

## JS compress PHP decompress

This works well. I can compress a UTF-8 string, get a compressed binary base64 back. I can decompress the binary base64
string into a UTF-8 string. The thing here is all conversions needed. See the code.

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2019-07-03 by Peter Lembke  
