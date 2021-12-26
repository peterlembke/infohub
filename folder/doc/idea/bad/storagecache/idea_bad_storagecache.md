# Storage cache

When I download some data to the client that I would like to keep updated I need to set a timeout and then ask the server if the checksums of the data need any update.
The server will answer what data to keep, update, delete.

I would like some middleware to handle this.

I want to ask the middleware for the data. The middleware give me the data it has and updates the data in the background if needed.

&& storage,cache

## Comment 1
I hesitate if this is a good idea or not. If you have a pair of plugins that act together then this StorageCache will act as a middle hand, and you have a dependency.
The StorageCache will own the data on the client. That is not good.

infohub_tree will be this middleware. With the drawbacks. So this idea will be implemented in Tree, but it will not be implemented generally.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2021-11-21 by Peter Lembke  
