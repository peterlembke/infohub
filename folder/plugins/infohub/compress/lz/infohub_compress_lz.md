# Infohub Compress LZ
Compress and decompress data with LZ.   

# LZ compression
lz-string was designed to fulfill the need of storing large amounts of data in localStorage, specifically on mobile devices. localStorage being usually limited to 5MB, all you can compress is that much more data you can store. 

# Implementation in PHP
lz-string is originally for Javascript but there are implementations in other languages. The PHP implementation is spread over several files so I have decided not to implement that implementation.   

# Implementation in Javascript
lz-string is originally for Javascript and you find it here:
http://pieroxy.net/blog/pages/lz-string/index.html 

# Testing
* JS compress JS decompress - FAIL . Original: 214 byte, Compressed: 76 byte, Decompressed: 214 byte 

## JS compress JS decompress
The text I compress is not equal with the decompressed text.  
The original is:
```
You can write some text in the text box labeled uncompressed text.
You can select what node will compress the data.
Click the button to compress the data.
Remove the text you wrote. Now click the button uncompress.
```
The uncompressed text is:
```
You can write some text in the text box labeled uncompressed text.
You can select what node will compress the data.
Click the button to compress the data.
Remoje the text you wrote. Now click the button uncompress.
```
Notice "Remoje".

I need to investigate this more.

# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2019-07-03 by Peter Lembke  
Updated 2019-07-10 by Peter Lembke  
