# Infohub Compress

Different methods to compress / decompress a data string.

# Introduction

This plugin and its child plugins give you a set of compress functions you can use.  
There are different kind of compression suitable for different kind of problems. Compression can be used to reduce the
size of the data before you transfer it to a node or before you store it in Storage.  
Infohub will use compression in transfer of data between nodes. In infohub Compress you will find different kind of
compressions and each child plugin have its own documentation

# A good compression

A good compression can compress any string and give you a string back you can send/store without any conversion.    
The compression must be quick and the decompression must be quick. The compression of the data, the reduction of data
must be so large that it is worth the effort to compress the data.  
My tests with gzip give 36% compression compared to the original string. The gzipped string include a base64 encoding on
the compressed data that adds 33% on the compressed data and still it is a good thing to compress.

# Built in compression

PHP have a built in function for compression, it is the ZLib functions. These functions are quicker to use directly and
they give a predictable answer every time so you can absolutely use them in your code.  
On the other hand, if you ever want to convert your plugin to other languages that do not have this built in then you
need to use a plugin. For example gzencode are a PHP function but do not exist in Javascript unless you use a plugin.  
There are other arguments for using the plugins. You can intercept the message and exchange the type. You get a unified
way of getting compressed data.

# gzip (native php, JS plugin)

Compression function that are used widely on the internet and are built into the HTTP protocol. gzip is a file format
and a software application used for file compression and decompression. The program was created by Jean-loup Gailly and
Mark Adler as a free software replacement for the compress program used in early Unix systems, and intended for use by
GNU (the "g" is from "GNU"). Version 0.1 was first publicly released on 31 October 1992, and version 1.0 followed in
February 1993.    
You can read more about Gzip on <a href="https://en.wikipedia.org/wiki/Gzip" target="_blank">Wikipedia</a>.

# LZ (do not exist in php, JS plugin)

lz-string was designed to fulfill the need of storing large amounts of data in localStorage, specifically on mobile
devices. localStorage being usually limited to 5MB, all you can compress is that much more data you can store.  
You can read more about LZ on <a href="http://pieroxy.net/blog/pages/lz-string/index.html" target="_blank">
pieroxy.net</a>.

# Libraries

There are many great libraries that do many nice things. InfoHub should remain simple, native, independent as far as
possible. That is why I do not add libraries to InfoHub.  
Infohub need one good compression function that can be implemented in all languages. Right now that need are covered
with gzip and possible lz.

# Testing

Infohub Tools have a compress tool where you can compress/decompress on the client/server.

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2019-07-03 by Peter Lembke  
Updated 2019-07-10 by Peter Lembke  
