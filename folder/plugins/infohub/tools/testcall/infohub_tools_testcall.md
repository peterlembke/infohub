# Infohub Testcall

Tool

# Introduction

With this tool you can compress data with [Infohub Compress](plugin,infohub_compress).  
There are different kinds of compressions. Check the link above to read more about them.

# GUI

This graphical user interface (GUI) shows:

## Compress

* Text box with uncompressed data
* Selector for compression node
* Selector for compression method
* Button - compress
* Text area with the meta data from the compress

## Uncompress

* Text box with compressed data, base64 encoded.
* Selector for uncompression node
* Selector for uncompresion node
* Button - uncompress
* Text area with the meta data from the uncompress

# Node

The plugin infohub_compress do all the work. The plugin come in a version for the server node and one version for the
client node. The server node are written in PHP. The client node are written in Javascript.

# Method

Some of the compression methods are the same so you can compress/uncompress between the nodes.  
Gzip exist in both javascript and in php. You can transfer data between them. LZ only exist in Javascript. You can use
LZ for storage locally.

# Usage

You can write your text in the text box under "Compress the data".  
You can select what node and method you want to use to compress the data.  
Click the button "Compress" to compress your text.   
Click on "Uncompress" to see the result. You unfold the result box.  
Remove the text you wrote. Now click the button "Uncompress" to see if the uncompression can restore your text.

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2019-07-07 by Peter Lembke  
Updated 2019-07-10 by Peter Lembke  
