# Infohub Storage Data IdbKeyval

Stores data in your web browser

# Introduction

<a href="https://github.com/jakearchibald/idb-keyval" target="_blank">IDB Keyval</a> is a wrapper library around
IndexedDb that gives you a key-value database that the Storage can use.  
The library helps reducing the complexity in the plugin. This library is the default storage solution in the browser.  
I normally never include libraries, but IndexedDb is such a sad piece that it really need to be hidden away.
The <a href="https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa" target="_blank">
large number of wrappers</a> around IndexedDb that you can find on the internet show that IndexedDb is not good enough
to be used in normal code.  
IDB Keyval is based on the async storage
in <a href="https://github.com/mozilla-b2g/gaia/blob/master/shared/js/async_storage.js" target="_blank">Mozilla Gaia</a>

# Installation

The library is so small that it is included in the end of the plugin.  
The instructions are here: <a href="https://github.com/jakearchibald/idb-keyval" target="_blank">IDB Keyval in
Githib</a>  
More info here: <a href="https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.js" target="_blank">IDB Keyval
in jsdeliver</a>  
More info here: <a href="https://www.npmjs.com/package/idb-keyval" target="_blank">IDB Keyval in NPM</a>

# Setup

Nothing to setup. IndexedDb are already in your supported browser and IDB Keyval will use it.

# IDB Keyval features

IDB Keyval is a key-value database but it is possible to get all the keys. You can match several keys with a pattern *
.  
IDB Keyval is a wrapper for IndexedDb and can therefore never be fast. It is still good since it hides away the awful
IndexedDb.

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2019-03-09 by Peter Lembke  
Updated 2019-03-09 by Peter Lembke  
