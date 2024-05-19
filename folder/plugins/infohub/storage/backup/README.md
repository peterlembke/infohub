# Infohub storage JS

This is the original JS Storage code.
It is identical in function to the PHP code.
It supports many storage engines.

In practice there is only one storage engine in a browser: indexedDb.
And the library I use is idbkeyval that store in indexedDb.

So the most logical would be to merge idbkeyval into infohub_storage.js to gain the maximum speed.
And that is what have been done.

The new infohub_storage.js directly uses idbkeyval. 



# License

This documentation is copyright (C) 2023 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2023-08-29 by Peter Lembke  
Updated 2023-08-29 by Peter Lembke  
