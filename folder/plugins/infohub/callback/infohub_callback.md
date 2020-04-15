# Infohub Callback
Turn the url into a message for infohub  
[columns]
# Introduction
callback.php and infohub_callback.php are server side files only.  
The web use urls with parameters, infohub do not. Callback.php is a mediator since it takes the parameters and turn them into a message suitable for infohub. The plugin is named Callback because the idea behind this was that most payment methods do a callback to the server, and they do it their way - with parameters in urls.  
Infohub Callback get all URLs that do not go directly to an existing file. It takes the url and split it up in variables and data like this: /var1/data1/var2/data2/var3/data3 into variables like url_var1=data1  
then it takes the URL parameters and add them too as variables like this: ?myvar1=data1 becomes get_myvar1=data1. And it takes the POST parameters and turn them into variables like post_thevariable1. Later it will also take the response headers.  

# Send to the right plugin
When Callback have all the incoming variables it compares them with the data in infohub_callback.json to see if there is a pattern match, that one of the entries have a pattern that matches some of the variables.  
When a pattern if found you also get the node, plugin and function to send the message to. You also get variables that will be sent to the plugin.  
The answer from the plugin will be handled so that the right value are echoed back on the screen as an answer to the caller.  

# Files in Callback
.htaccess - The root file that reroute URLs to callback.php (For Apache web server)  
callback.php - The root file that receive all URLs  
infohub_callback.php - The plugin used by callback.php  
infohub_callback.json - Configuration, used by the plugin. Here you put your patterns.  
infohub_callback.xml - This documentation  

# infohub_callback
This plugin is written specifically for usage with callback.php but you can call infohub_callback and its main function to get all parameter data.  
infohub_callback is quite useless without callback.php. If you have started the infohub core and gone through the kick-out tests then there is no URL-parameters to find and no pattern will match.  
The plugin uses cURL to call infohub.php and give it the message with all URL parameters. That might be an interesting thing to open up later for doing async execution of packages in more php sessions.  

# How can I use Callback
The original idea for Callback was to receive callbacks from payment methods like DIBS, Adyen, Swish etc. And that will eventually be the case when You write a payment method for InfoHub.  
One early version of the documenting system use Callback to reach [infohub_doc](plugin,infohub_doc). The documenting system then works totally without the client side core.  

# Configuration
The documentation system have one entry in the configuration file: infohub_callback.json. It looks like this:  

```    
    "doc": {
        "enabled": "true",
        "ip_valid": [
            "127.0.0.1",
            "192.168.0.1"
        ],
        "pattern": {
            "url_doc": "plugin"
        },
        "data": {
        },
        "data_back": {
            "read_return_parameter": "data"
        },
        "to": {
            "node": "server",
            "plugin": "infohub_doc",
            "function": "show"
        }
    }
```    

- "doc" is the name of the configuration. Any name you want.
- "enabled", if this config can be used or not. Observe "true" or "false"
- "ip_valid", is the ip numbers that is allowed to call this address. Use "ip_valid": ["*.*.*.*"] for public access.
- "pattern", are the combination of variables that must exist. Both the variable names and their data. In this case you see that /doc/plugin must exist some where in the URL for the pattern to match. Remember you can use: url_variable, get_variable, post_variable
- "data", Variables that will be added on top of the incoming data and overwriting the incoming data if the variable names are the same.
- "data_back", Variables that will return untouched as data from the plugin call.
- "to", The destination for this message.

# .htaccess
Why use .htaccess? It slows down Apache and do not work in the web server Nginx. Apache discourage the usage and Nginx will never implement it.  
The reality is that most web hosts that you can rent uses Apache, and they do not allow you access to the apache settings. Your only option is to use a .htaccess file.  
If you do have access to the Apache settings then you can transfer the content of the .htaccess file to the central config in Apache.  
Nginx is built for speed. InfoHub probably work very well in Nginx. One day there will be a complete guide for installing InfoHub on Nginx. Until then you can <a href="https://www.nginx.com/blog/creating-nginx-rewrite-rules/" target="_blank">find a good guide here</a>.  
[/columns]

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-03-20 by Peter Lembke  
Updated 2018-08-11 by Peter Lembke  
