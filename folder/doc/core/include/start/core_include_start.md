# start.js
Starts up the core plugins and sends the first message.  

# Introduction
infohub_start, The only plugin that is added with index.php  
It is a one way flow that will goto the end no matter what, and after that the Core are started.  

# Client core

## cookies

Local storage is only available to Javascript if you enable cookies. You can disable 3rd party cookies.

You can get more information from this article: [why-using-localStorage-directly-is-a-bad-idea](https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/#typeerror-cannot-read-property-getitem-of-null).

And how to enable cookies is [here](https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=en).
 
So why don't I use an in-memory variable as it is mentioned in the article above? After logging in I store data in indexedDb so that is OK. Then I reload the page.
Then I need to download the InfoHub Core plugins again and see if I am logged in with the data in indexedDb. That would have a major performance impact and would not be good for people with cell phones and slow internet connections.

I might change this in the future but for now I will just test if cookies are enabled in start.js  

## `_ColdStart`
Sets a flag "cold_start" in localStorage containing the number of failed starts. In InfoHub_launcher after the last thing has rendered the flag is removed.  
If you need to reload the page before the flag is removed then it is considered a failed start. On the first failed start all the plugins are removed from localStorage.  
On the second failed start both the plugins in the localStorage and the database in indexedDb are deleted. Now we have a clean start.  
If the start takes longer than 20 seconds then a timer will do a full reload automatically.  
    
## `_GetCorePluginNames`
Get a list with all core plugin names.  
Here you can add plugins that should be required in your setup  
    
## `_GetMisingPluginNames`
Check what plugin names is missing in the localStorage  
    
## `_CallServer`
Prepares a package with the missing plugin names and calls the server with ajax. $package = getPackage($missingPluginNames); callServer($package) with ajax.  
    
## `_HandleServerResponse`
Server send back the missing plugins  
    
## `_GetPluginsFromResponse`
Convert the response to an array and pull out the plugins.  
    
## `_StorePlugins`
Store the plugins in localStorage. Do not care about indexes. The plugins will be taken care of later in infohub_cache::validate_cache   
    
## `_StartCore`
* Get the list with all core plugins
* Start all core plugins (Use eval for that) but do not instantiate a plugin object.
* Instantiate infohub_exchange and let it instantiate the rest of the started plugins.
* Send first message to infohub_exchange.
    
# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2015-11-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
