# Node fence
Sensitive data like reading a GPS-position from a GPS plugin will mark that message response with node_fence = ”true”.
Those messages will never be allowed to leave the node they are in. The flag will follow to the plugin that requested the data and will follow all data going out from the plugin.
Infohub transter refuse to send messages to other nodes that have this flag set.

&& traffic

## Comment 1
It is a very bad idea to use location. Infohub will not use location.
Node fence is a false protection. It complicate the code. Node fence is a bad idea.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2021-11-21 by Peter Lembke  
