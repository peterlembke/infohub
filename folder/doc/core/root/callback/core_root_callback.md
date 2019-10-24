# Callback.php
Callback.php were designed for ONE purpose:  
Handle callbacks from services, mostly payment services, like Swish, DIBS, Klarna and [many others](https://en.wikipedia.org/wiki/List_of_online_payment_service_providers).  
But it can also be used for:  
Easy testing of plugins by converting get/post variables into a message  
In a normal setup when you do not use payment services or need to test something then you do not have the file callback.php on your server.  

# How it works
The file [.htaccess](main,core_root_htaccess) have the redirect rules.
All other combinations of paths/get-parameters goto callback.php.
  
callback.php do some tests:  

- That you execute this file and not try to include it.
- That you do not try to call callback.php directly by its name.

Then sets up folders and error handlers and execution parameters just as index.php and infohub.php does.
Then sets up an autoloader that can load requested plugins.
              
Now we start infohub_callback and directly call the public function main().
We are now in the plugin [infohub_callback](plugin,infohub_callback)  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
