# Client
Your browser is called the client node. It is dependent on the server.  

# Introduction
When you install a program on your computer then that program has everything it needs to work.
When you want to run a program in your browser then it has nothing except a domain address where the program is. It is almost like an installation.
This document want to describe the special relationship between the web server (called here the "server") and the web browser (called here the "client").
          
# Get it started
Index.php is the file that you get when you surf to the web address. Read more here [index.php](main,core_root_index)  
One file that are included are [start.js](main,core_include_start). In the end of that file you see that the infohub_start plugin is started  

```
var $infohub_start = new infohub_start();
$infohub_start.start();
```

The start function have a list of all plugins that should be available, then checks what plugins exist in the localstorage.  
If any plugin is missing then an ajax call is done to the server to get the missing plugins. Then store the plugins from the response into the local storage.  
When all plugins are in local storage then they are all started. Now we have the core plugins started, we now only need the first message that triggers it all.  
The first message will goto client->infohub_exchage->startup, but how will we get it into the system? If you look at the end of startup.js you see an event listener called infohub_call_main.
The event listener are usually used when we have data from an event and want that as a message into the system. See [the_go_function.js](main,core_include_thegofunction). Now we send an event with the first message.  

# Infohub Exchange
When you send a message through the event infohub_call_main the message are put in a package (an array) with the destination client->infohub_exchange->main.
And that package are given to infohub_exchange.cmd(). The return value are discarded.  
You can read more about [Infohub Exchange](plugin,infohub_exchange).  
There is a configuration file called infoub_exchange.json that hold domain names and the start message for each domain name.
In startup it pulls the current domain name and checks the configuration what message to send.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-01-20 by Peter Lembke  
