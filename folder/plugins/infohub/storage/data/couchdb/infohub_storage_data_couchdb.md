# Infohub_Storage_Data_CouchDb

Stores data in a CouchDb server

# Introduction

[CouchDb](http://couchdb.apache.org/) is one of the supported database engines that Storage will use in the future.  
CouchDb is a server, manages many concurrent connections and heavy load, open source.  
The main features for CouchDb is its excellent replication feature, and that it communicate with HTTP and JSON.  
Another great feature is that PouchDb and CounchDb can sync with each other.

# Installation

See the official [installation guides](https://wiki.apache.org/couchdb/Installation).  
__Docker__ You can run CouchDb from a docker container. Read more
here <a href="https://hub.docker.com/_/couchdb/" target="_blank">Docker CouchDb</a>. You can start several containers on
the same computer. Each have its own port.

# PouchDb

PouchDb is run on in the browser and uses the IndexedDb database to store data. The main feature with PouchDb is the
syncronisation of data with a CouchDb server. The aim for Infohub is to take control of all web requests. PouchDb do its
own requests. That is not compatable.

# CouchDb

The Infohub server will contact the CouchDb server. The Client will not contact CouchDb directly. There will be a
wrapper in Infohub so you can us CouchDb just like any other Storage.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-04 by Peter Lembke  
Updated 2019-08-23 by Peter Lembke  
