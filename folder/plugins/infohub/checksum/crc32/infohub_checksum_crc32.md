# InfoHub Checksum CRC32

Calculate a CRC32 checksum

# Introduction

This plugin help you calculate CRC32 checksums.  
The CRC32 checksum was designed in 1962 to detect burst errors in data streams. Read more about CRC
at <a href="https://en.wikipedia.org/wiki/Cyclic_redundancy_check" target="_blank">Wikipedia</a>, it is an interesting
story.  
One feature with CRC32 is that you can continue adding data to the checksum when the data come from the stream.  
InfoHub do not use CRC32, instead the main checksum type is MD5.

# CRC-32

CRC (Cyclic Redundancy Check) and 32 = number of bits in the checksum. CRC have an interesting history that you can read
on wikipedia.  
Have good collision-resistance for the application it was designed for (detecting noice in transmissions). It has been
used since 1962 in different applications.

# Implementation in PHP

PHP has a built-in function crc32() that you can use. See the parent document about "Built in checksums".

# Implementation in Javascript

Javascript have ZERO commands of any checksum algorithms. That is so bad. All implementations are done in
Javascript-code instead.  
The CRC32 implementation come
from <a href="http://stackoverflow.com/questions/18638900/javascript-crc32" target="_blank">stackoverflow</a>, written
by author <a href="http://stackoverflow.com/users/1775178/alex" target="_blank">Alex</a>.  
License. Stack Overflow say this: "all user contributions are licensed
under <a href="http://stackoverflow.com/help/licensing" target="_blank">Creative Commons Attribution-Share Alike</a>".  
Read more about <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC BY-SA 3.0</a>  
The code is then part of plugin infohub_checksum_crc32.js

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-25 by Peter Lembke  
