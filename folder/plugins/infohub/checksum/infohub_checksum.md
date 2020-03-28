# Infohub Checksum
Different methods to calculate a checksum  

[columns]
# Introduction
This plugin and its child plugins give you a set of checksum functions you can use.  
There are different kind of checksums suitable for different kind of problems. Checksums can be used to find data, compare data, validate data.  
Infohub use checksums for all plugins to detect changes in the code. In infohub_checksum you will find different kind of checksums and each child plugin have its own documentation  

# A good checksum
A good checksum take in account both the characters in the string and their position in the string.  
Two different data can get the same checksum. A good checksum have good collision-resistance, meaning that two different data should seldom get the same checksum.  

# Built in checksums
PHP have a built in function for calculating CRC32, MD5 etc. These functions are quicker to use directly and they give a predictable answer every time so you can absolutely use them in your code.  
On the other hand, if you ever want to convert your plugin to other languages that do not have this built in then you need to use a plugin. For example MD5 and CRC32 are PHP functions but do not exist in Javascript unless you use a plugin.  
There are other arguments for using the plugins. You can intercept the message and exchange the type. You get a unified way of getting checksums.  

# md5 (native php, JS plugin)
Checksum function that detect unintentional data corruption  
Ronald Rivest created MD5 in 1991. MD5 was designed to be used in encryption, but it is no longer useful for that purpose. It can still be used as a checksum to verify data integrity, but only against unintentional corruption.. You can read more about MD5 on <a href="https://en.wikipedia.org/wiki/MD5" target="_blank">Wikipedia</a>.  

# CRC32 (native php, JS plugin)
This plugin help you calculate CRC32 checksums.  
The CRC32 checksum was designed in 1962 to detect burst errors in data streams. Read more about CRC at <a href="https://en.wikipedia.org/wiki/Cyclic_redundancy_check" target="_blank">Wikipedia</a>, it is an interesting story.  
One feature with CRC32 is that you can continue adding data to the checksum when the data come from the stream.  
Infohub do not use CRC32, instead the main checksum type is MD5.  

# Soundex (native php)
Soundex is a phonetic algorithm for indexing names by sound, as pronounced in English.  
The algorithm was invented in 1918 by  Robert C. Russell and Margaret King Odell.  
Soundex is used in databases and is the base for many more modern versions of phonetic algorithms. You can read more about Soundex on <a href="https://en.wikipedia.org/wiki/Soundex" target="_blank">Wikipedia</a>.  

# Metaphone (native php)
Metaphone is a phonetic algorithm for indexing any word in English.  
The algorithm was invented in 1990 by Lawrence Philips.  
You can read more about Metaphone on <a href="https://en.wikipedia.org/wiki/Metaphone" target="_blank">Wikipedia</a>.  

# Double Metaphone (php plugin lib)
Double Metaphone is a phonetic algorithm for indexing any word in English.  
The algorithm was invented in 2000 by Lawrence Philips as the second generation of the Metahphone algorithm.  
You can read more about Double Metaphone on <a href="https://en.wikipedia.org/wiki/Metaphone" target="_blank">Wikipedia</a>.  

# Why not fall back to another node
It would be cool to reroute the checksum request to another node if the requested checksum type do not exist in this node. Yes, that would be easy to do but it should not be done, because the value you want to have a checksum on is probably sensitive data.  
Checksums are often used to reduce network traffic by verifying that the data you already have is still valid. If we sent the value to another node then we would increase traffic instead.  
Checksums are used to verify that the data you get have not been modified. If you let someone else get the data and do the verification, then we have a trust issue.  

# Libraries
There are many great libraries that do many nice things. InfoHub should remain simple, native, independent as far as possible. That is why I do not add libraries to InfoHub.  
Infohub need one good checksum function that can be implemented in all languages. Right now that need are covered with md5 and possible crc32.  
Other uses of checksum, like the Luhn and Personnummer that have a specific usage, will be added as child plugins.  
When encryption are added as a plugin, then there will be need for encryption secure checksums, and those might be added to then checksum plugin, or to the encryption plugin.
[/columns]

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2016-11-03 by Peter Lembke  
Updated 2018-08-11 by Peter Lembke  
