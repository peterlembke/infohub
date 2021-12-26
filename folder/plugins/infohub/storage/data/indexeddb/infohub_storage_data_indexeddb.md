# Infohub Storage Data IndexedDb

Stores data in your web browser

# Introduction

<a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank">IndexedDb</a> is one of the
supported database engines that Storage can use.  
IndexedDb is in your browser, can store a lot of local data and makes your InfoHub programs manage without a server for
long periods.  
I normally never include libraries, but IndexedDb is such a sad piece that it really needs to be hidden away.
The <a href="https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa" target="_blank">
large number of wrappers</a> around IndexedDb that you can find on the internet show that IndexedDb is not good enough
to be used in normal code.

# Installation

You just need one of the supported browsers installed: Firefox (or Tor Browser), Chrome (or Chromium), Opera.  
To be a supported browser it must be of the latest version, support major features, and work in the latest version of
Windows and macOS and Ubuntu Linux.  
There are other unsupported browsers like Edge (Only Windows), Safari (Only macOS), GNOME Web (Only Linux with Gnome).  
Microsoft Internet Explorer and Microsoft Edge can not be used with InfoHub. They have partial support for IndexedDb,
but lack other well established technologies that the supported browsers have had for a long time.  
Safari could have been a supported browser if it had existed on Linux and Windows. Safari have good support for all
technologies. You can still use InfoHub with Safari but there will never be fixes in InfoHub for running better in
Safari.

# Set up

Nothing to set up. IndexedDb are already in your supported browser.

# IndexedDb features

IndexedDb can have named databases with named object stores. Sounds like a normal database but it is not. The way
databases and object stores are handled gives you a creeping thought "Is this the final specification on IndexedDb?".  
To be able to reduce the amount of code and to keep some important resources (sanity and joy) I have simplified the
usage. There will be one database called "main" and in that database there will be one object storage called "main".  
As with all InfoHub Storage, the structure will never change. There might be a change to this in the future but right
now I do not see any reason to that.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2017-03-10 by Peter Lembke  
Updated 2017-03-10 by Peter Lembke  
