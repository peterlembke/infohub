# Database on localhost

If I had a local database with a web interface on my computer that responded only to localhost then the client could store data there instead of the browser indexedDb.

&& storage,local

## Comment 1
Running a local database on localhost is not a bad idea. It is also a bit complicated to set up.
The very point of Infohub is to protect your private data and have it available on all your devices.
If you save data to indexedDb in the browser and then sync it up to the server or if you save data to a local server and sync it up to the server is just the same thing.

The benefits of having a localhost server is that the browser storage is quite easy to erase. The indexedDb is slow.
The indexedDb lack features and tools that other databases have.

On the other hand. The client ONLY talk with the server. No exception.
If you want a local storage on localhost then install the Infohub server locally. Then you have the full range of database engines to choose from.

I will later add features to sync data between infohub servers. Then your local server will have all data.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2021-11-21 by Peter Lembke  
