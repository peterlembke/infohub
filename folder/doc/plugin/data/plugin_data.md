# Download data
How to download the data you need from the server to the client.  

# Introduction
start.js download the missing plugins you commonly need. InfoHub Plugin download the plugins you need and do not have locally yet. InfoHub Asset download the images and file data you need for a plugin you started.  
So plugins and assets are covered. But what about other data. InfoHub Doc download the missing documentation when you want to see it.  
All these examples download as little data as possible to reduce bandwidth and waiting times. That data are then reused from the local Storage (localStorage and indexedDb).  

# List with data
The client should be able to request a list with data. The list should contain names of the data and their checksums so the client can compare with what they already have.  
The list itself also has a checksum that makes it is easy to detect if a list has changed.  
The client can then figure out from the local list and the server list what data that are missing or changed, then it can request that data from the server.  

# Bandwidth
InfoHub try to use as little bandwidth as possible and as few requests as possible.  
It is always the client that request data lists and what data to download. The client must know how much Mb it can get in a response and not ask for more data than that.  
Messages are automatically bundled together in packages. That means the client can send several requests to the server in one request.  

# Reuse data (cache)
The data that the client have downloaded should be stored locally and reused. Store the data with a datetime stamp and the client then decide how long time the client consider the data to be valid.  

# Update data (cache)
When the client version of the data list is old then request a new list from the server IF the client is online.  
The client send the checksum of the local list to the server. If the server list has the same checksum then a do:keep is sent back.  
If the checksum is different, then a do:update is sent back together with the new list.  
The client can then compare the local list with the latest server list and request the data that is changed or new, but also delete data that are obsolete.  

# Offline data (cache)
When you are offline then the local data have to make due. No update messages will be sent and that is that.  

# Going offline on purpose
InfoHub_Offline can download all data. Right now it can download all client plugins, all assets, all documentation.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-12-31 by Peter Lembke  
Updated 2021-08-28 by Peter Lembke  
