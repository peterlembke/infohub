# Infohub Storage Data LocalForage

Stores data in your web browser

# Introduction

<a href="https://localforage.github.io/localForage/" target="_blank">LocalForage</a> is a wrapper library around
IndexedDb that gives you a key-value database that the Storage can use.  
The library helps reducing the complexity in the plugin. This library is the default storage solution in the browser.  
I normally never include libraries, but IndexedDb is such a sad piece that it really need to be hidden away.
The <a href="https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa" target="_blank">
large number of wrappers</a> around IndexedDb that you can find on the internet show that IndexedDb is not good enough
to be used in normal code.

# Installation

The library is a central part on the client and I have pasted the wrapper code in the plugin directly. I use version
1.6.0  
The instructions are here: <a href="https://localforage.github.io/localForage/" target="_blank">LocalForage API</a>  
You find the github repository here: <a href="https://github.com/localForage/localForage" target="_blank">
LocalForage</a>

# Setup

Nothing to setup. IndexedDb are already in your supported browser and localForage will use it.

# localForage features

LocalForage is a key-value database but it is possible to get all the keys. I will add support for keys matching just as
I already did for the server plugins. Then you will be able to match several keys with a pattern *.  
LocalForage is a wrapper for IndexedDb and can therefore never be fast. It is still good since it hides away the awful
IndexedDb.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2018-03-17 by Peter Lembke  
Updated 2019-03-09 by Peter Lembke  
