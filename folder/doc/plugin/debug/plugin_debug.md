# Debug your plugin
How to debug a plugin.  

# Introduction
When things do not work with your plugin then you need to debug. You need template, tools, techniques, training to easily find errors.  

# Template
Select the template that are suitable for the type of plugin you want to create.  
In Javascript, make sure ALL functions have the extra row before the function declaration, like this:  

```
$functions.push("get_launch_information");
var get_launch_information = function($in) {
```

Make sure all your cmd-functions are listed in `_GetCmdFunctions` like this: (Example from infohub_doc.js)  

```
var _GetCmdFunctions = function () {
    return {
        'get_launch_information': 'normal',
        'view_document': 'normal',
        'view_navigation': 'normal',
        'setup_gui': 'normal',
        'event_message': 'normal'
    };
};
```

# Bare bone template
This is the bare minimum you need for a plugin to work. Suitable for normal plugins that have no GUI and are not a renderer.  
    
# Render
If you create a renderer then this template is suitable as a start. You can also take a look at other renderers like infohub rendermajor.  
If your renderer do not work then put a break point in function "create" and see if it is reached. Then you can see if the input data is correct before and after `_Default`.  
Renderers are client plugins and they should then show up in local storage. Right click on the web page, select the inpector, storage, local storage. You should find your plugin there or else.  
    
# GUI
If your plugin need a graphical user interface then select this template or copy parts from this template.  
If the plugin do not show up in the list of known plugins then refresh the list in Workbench.  
You need an asset/launcher.json file like this:  

```
{
    "plugin": "infohub_doc",
    "title": "Documentation",
    "description": "You can read all documentation files with this application. You get a navigator and a document index"
}
```

Make sure your `_GetCmdFunctions` have "'setup_gui': 'normal'" and that you have the function setup_gui.  
You also need asset/icon/icon.svg and asset/icon/icon.json. See how other plugins have done this.  
    
# Tools
You can place break points in your code and there you can see the content of the variables. This can be done in both PHP and Javascript.  

# PHP tools
The main tool is a good editor and xdebug. This combination is so essential that no one would care to help you if you do not use xdebug or a similar feature
because xdebug will show you exactly what is happening in all variables in real time. Just install it.  
    
# Javascript tools
The main tool here are the inspector that are built into your browser. Right click on a web page and select "Inspect elements". Now you can debug javascript. Learn the inspector, at least the javascript debugging.  

# Techniques
Keep calm, work when you are alert, have a never ending patience. Here are some logical tricks you can apply:  

# On screen errors
Package errors: If there are errors in the package from the server then a message will be shown on screen in the browser.  
External references: The file incluse/sanity_check.js always scan the DOM for any reference to files outside of the domain and warn on screen about that. Never ever use external references to scripts, images etc.  
Javascript errors: A popup will show the error. See include/error_handler_and_frame_breakout.js  
Ban time: If you got banned then your remaining ban time will show up. The server and client normally handle bans and no message should actually ever appear.
The ban scripts are here: include/kick_out_tests.php  
    
# Error handlers
Some programmers like to wrap everything in try-catch, some even trigger error events themselves. I recommend that you do not use that technique. Instead handle the problems where they appear and return a normal message instead.  
Just as a precaution you are always wrapped in try-catch in the cmd() function. But try to avoid getting caught in that, handle your own problems.  
Use try-catch when it is really needed inside your function when you use a command that could throw an exception to you instead of handling their own issues.  
In PHP the general error handler: include/settings_and_errors.php  
In Javascript the general error handler: include/error_handler_and_frame_breakout.js  
You can set break points in these error handlers if you need to.  
    
# Logging
Both JS and PHP has logging. PHP log to files in "folder/log". JS log to the browser console (Right click the page and select "Inspector").  
Logging takes time and are normally restricted to severe errors.  
In your code you can use the function $this->internal_Log(), it is part of the base class, see [InfoHub Base](plugin,infohub_base)  
The functions cmd() and internal_Cmd() both use internal_Log to log how the traffic goes.  
    
# Selective logging
When you run PHP code on a server, perhaps your web host, then you do not have access to xdebug. Instead you can use selective logging.  
Each plugin can have a configuratuon file. This is an example from infohub/checksum/infohub_checksum.json  

```
{
    "server": {
        "log": {
            "calculate_checksum": "Can be left empty",
            "internal_CalculateCrc32": "Only internal functions called with internal_Cmd can be logged"
        }
    }
}
```

In this case we log two functions. The logging will be to folder/log/plugin_name.log.  
    
# PHP Server
It is quite easy to debug the server with xdebug. PHP is single threaded and do one thing at the time. Just make sure you have xdebug and learn how to use it.  
If your plugin is not loaded then check that: your web server has read rights on the php file.  
You should not install xdebug on a production server because PHP will be much slower. Instead use selective logging.  

# JS Client
The JS client depend on the server for automatically downloading data. You should check the traffic to the server with the inspector -> network. Here you can see what is sent in the package and what you got back.
The response should be readable and look sane.  
All plugins that are downloaded are saved in the local storage. If you do changes in a JS plugin then you ned to delete that plugin from the local storage and then refresh the page. Alternatively you can refresh twice. The plugins are updated automatically when they got old and there is a new version.  
All assets (icons etc that exist in the plugin folder "asset") are saved in indexedDb. If you want to reload an asset you need to delete it from indexeddb. For four of the plugins (workbench, asset, doc, demo) you also need to delete the assets from the local storage too.  
    
# Return
The return statement you must use in all your functions can be wrong. If you return a response then you must have at least "answer" and "message" in the response.  
If you do a sub call then do not forget to use the `_SubCall` function so your data are correctly formatted.  

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': $response.data,
        'how': $response.how,
        'where': $response.where
    },
    'data_back': {
        'step': 'step_end',
        'alias': $in.alias
    }
});
```

# Exchange
All messages goes trough exchange. It would be tempting to set a debug point there. But first check that you follow all rules in your plugin.  
    
# Training
With training and experience you create your own style of programming. Remember that you do whatever you like in your plugin so the below tips are just how I do things. My aim is always readability and always do the same.  
Step - I use "if ($in.step === 'step_start') {", each step name start with "step_" so I know that it is a step label.  
Step - If I have a step with a subCall, for example "step_read_storage" then I also have a "step_read_storage_response". That step handle the response and continue in the next step.  
goto - I prefer to have one final return call at the end of the function. Instead of using nested if statements I use goto leave; and quickly bail out to the return call.  
Check, Do, Report - I always start a function with checking the data and bail out on error, then do something with the data, and then report back.  
Default - In PHP you should use $this->_Default, in Javascript you MUST use `_Default` or else your changes to the object affect the object outside of your function too.  
Variable naming - An array with products will get the name "$productsArray". Describing names are very important for readability. $itemsLeftToProcessArray  
Variable naming - In PHP all variables start with $, in Javascript the $ is optional. I always use $ in both languages for readability.  
Variable declaration - In JS, make sure you declare all variables first of all in your function with a single "var". PHP have no declaration command. Try to set the variables with any value at the top anyhow.  
Use "use strict"; in your Javascript functions. Can be used everywhere except in functions that need to do something not allowed by the strict mode.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Updated 2017-07-10 by Peter Lembke  
