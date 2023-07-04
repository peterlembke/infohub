# InfoHub Base

The class that all plugins extend from.  
[columns]

# Introduction

When you create a plugin you start by extending the base class. This is always the case. You do not extend any other
class, and you do not use any fancy php tricks to implement features from other classes.

InfoHub Base give your plugin all the base features it needs to function within the InfoHub core and be a part of the
message system.

# cmd()

All communication with your plugin goes through the public function cmd(). You give cmd() an array, and it will call the
function you mention in the array.

With cmd() you get: logging, execution time, checks on incoming data, check that the called function exist, catching and
logging errors, construction of {{subcall}} and {{returncall}} messages.

The main feature with cmd() is that your plugin become loosely coupled with other plugins. In traditional systems you
make a dependency to a specific class and run a command in that class. In InfoHub you send a message to a plugin and ask
if it would like to do something.

# Cmd functions

{{Cmd}} functions are those private functions that you can reach with the public {{cmd}}() function from outside a
plugin. The function name must be in lower case and start with a letter. Like this: `my_nice_function()`

The {{cmd}} functions always return a {{subcall}} message or a {{returncall}} message to cmd() and then cmd() deliver
that message to the outside of the plugin. The message is picked up by [infohub_exchange](plugin,infohub_exchange) and
delivered to the destination plugin.

Because of that you can not directly use your other cmd() functions in your plugin by doing a simple direct call.
I recommend that you put code in {{direct}} functions and even better; in {{internal}} functions.

To properly use any cmd() function you do a {{subcall}}. You also need to {{register}} all cmd functions.

You MUST register your cmd() functions in your plugins function `_GetCmdFunctions()` or else they will not work. Read
more about that here: [Function Status](doc,plugins_status) and also read about [version numbers](doc,plugins_version).

# Direct functions

In the base class you also have functions that you can call directly. The most commonly used function are `_Default()`.
These functions start with an underscore `_` and then the name is in CamelCase.

The PHP version and the JavaScript version of the base class have different functions, and it is because of different
needs in different languages. JavaScript has  an important function called `_ByVal()`, and PHP have the same feature
built into the language.

You can write your own direct functions in your plugin. but I would recommend that you only use them for simple stuff
that will be reused a lot in your plugin. The best alternative are `internal_Functions`.

One example of a direct function is `_Default`.

```
$in = $this->_Default($default, $in);
```

# Internal functions

Internal functions work like cmd functions but the range is internal in your plugin. The function names look like
this: `internal_MyFunction()` and you call them by calling `internal_Cmd()`.

If you use `internal_Cmd()` then you get execution time for your function, logging what is happening, it checks that the
called function exist, catches errors for you, and gives the test system data to use.

You do as you please in your own plugin. The recommendation is to use internal functions instead of direct functions.

# Calling Internal functions

You can call an internal function directly, but then you do not get the benefits:

```
$this->internal_Log(array(
    'function_name' => 'my_function',
    'message' => 'My message',
));
```

The recommended way is to use `internal_Cmd()` like this:

```
$this->internal_Cmd(array(
    'func' => 'Log',
    'function_name' => 'my_function',
    'message' => 'My message',
));
```

# SubCall

One of the features is to make a subcall to another cmd function in the same or other plugin on the same or any other
node. Be aware of what plugin you are allowed to call, or you will get a return message with a rejection.

When you do a subcall you leave the cmd function with a return call, leaving the control back to cmd(). A subcall will
give you an answer back. The answer will go to the cmd function that made the call. Meaning that if you do the subcall
in an internal function, the answer will still go to the cmd function.

In the subcall, you can add variables that you want back untouched when the answer comes back to you. With these
variables you can step forward in your code and continue execution to after the subcall.

## SubCall example #1 - Direct subcall

In this first example we will do a common subcall to get some more information

```
$default = {
    'step': 'step_plugin_list',
    'parent_box_id': '1',
    'response': {}
};
$in = _Default($default, $in);

if ($in.step === 'step_plugin_list') {
    return _SubCall({
        'to': {
            'node': 'client',
            'plugin': 'infohub_plugin',
            'function': 'plugin_list'
        },
        'data': {
            'parent_box_id': $in.parent_box_id
        },
        'data_back': {
            'step': 'step_handle_response'
        }
    });
}

if ($in.step === 'step_handle_response') {
```

In this JavaScript example you see part of a function. We start with step `step_plugin_list`. In that step we do a
subcall to a specific node, plugin, function. We send some data (`parent_box_id`) and we want some data back untouched (
step).

When the answer come back it is in 'response' as an array/object. Step is now `step_handle_response`. In that
if-statement you can run a `_Default` on the 'response' and start using it.

## SubCall example #2 - Callback function

Callback function only works with Javascript. It does not exist for PHP because it is not needed.

Javascript heavily use callback functions as an imaginary solution they use when something might take time to do. PHP on
the other hand generally not use callback functions, and they do fine.

Javascript simply say "This thing you asked me to do will take some time, I'll call a separate function when I am done, so you can now continue with other things". If you really need the answer to continue then you are trapped. To prevent this situation Javascript have invented Promises. Instead of the result you now get a promise variable that eventually
will give you the answer. And there are more features around simplifying the use of promises. This does not help
you. You are still stuck in that callback/promise hell.

InfoHub in JavaScript give you a `callback_function` that you can call when you want to get out of the hell. Here is an
example:

```
const startup = function ($in) {
    "use strict";
    const $subCall,
        $default = {
            'step': 'step_plugin_list',
            'parent_box_id': '1',
            'callback_function': null,
            'response': {}
        };
    $in = _Default($default, $in);

    if ($in.step === 'step_plugin_list') {
        $subCall = _SubCall({
            'to': {
                'node': 'client',
                'plugin': 'infohub_plugin',
                'function': 'plugin_list'
            },
            'data': {
                'parent_box_id': $in.parent_box_id
            },
            'data_back': {
                'step': 'step_handle_response'
            }
        });

        // Use callback if you need to
        $in.callback_function($subCall);
        return {};
    }

    if ($in.step === 'step_handle_response') {
```

This second example is almost identical with the first one. Only difference is that we use the callback function to
return the subcall and then return an empty object to leave the function.

You can use the callback function for normal return calls too. See section below.

# ReturnCall

When you return something in your cmd function then it is evaluated by cmd(). If it is not specified as a {{subcall}}
then it is a {{returncall}}. cmd() will construct the returncall message.

## Example #1 - Direct return call

End your function with a return call. Since this is not a subcall then InfoHub will make this into a return call and
return the data to the function that is the caller.

```
return {
    'answer': 'false',
    'message': 'Did not handle the event message',
    'any_variable': 'my data'
};
```

## Example #2 - Callback function

You use the callback function in Javascript when you need to leave a callback/promise hell behind you.

```
$out = {
    'answer': 'false',
    'message': 'Did not handle the event message',
    'any_variable': 'my data'
};
$in.callback_function($out);
return {};
```

# Loops

You can have sub calls in loops. This example come from `infohub_asset`, (before I changed it to use multi message, and
again changed it to use `write_many`)

```
if ($in.step === 'step_save_assets') {
    if (_Count($in.data_back.data) > 0) {

        $response = _Pop($in.data_back.data);

        return _SubCall({
            'to': {'node': 'client', 'plugin': 'infohub_storage', 'function': 'write'},
            'data': {
                'path': $assetPath + $response.key,
                'data': _ByVal($response.data)
            },
            'data_back': {
                'step': 'step_save_assets',
                'data': _ByVal($response.object)
            }
        });
    }
    $in.step = 'step_end';
    $message = 'Done updating assets in the client storage';
}
```

In the example you can see that the loop continue as long as `$in.data_back.data` contain any items.

I pop one item from `$in.data_back.data`, shortening it. `_Pop` return an object with the popped "data" and what is left
in the "object".

The sub call return to this function and step and the next iteration can occur as log as there are data.

# Multi message

In some cases when you use a loop you might instead use multi messages. That is when you do not really care about the
response of the sub call.  
The example with the loop can be written like this using multi messages instead:

```
if ($in.step === 'step_save_assets')
    {
    $messageArray = [];
    for ($key in $in.data_back.data) {
        if ($in.data_back.data.hasOwnProperty($key)) {
            $messageOut = _SubCall({
                'to': {'node': 'client', 'plugin': 'infohub_storage', 'function': 'write'},
                'data': {
                    'path': $assetPath + $key,
                    'data': _ByVal($in.data_back.data[$key])
                },
                'data_back': {'step': 'step_end'}
            });
            $messageArray.push($messageOut);
        }
    }
    $messageArray = _ByVal($messageArray);
    $in.step = 'step_end';
    $message = 'Done updating assets in the client storage';
}

return {
    'answer': 'true',
    'message': $message,
    'messages': $messageArray
};
```    

In this example you do no sub calls (but you could), the important thing here is that you pass the property: 'messages'
to the return call or sub call.

The messages will have a short callstack. Meaning that they can not go further back than to this point in the code.
Perfect if you do not care about the return message.

The code that make multi message possible is in `infohub_base` in the end of the cmd() function. The trick here is that
the messages all receive the parameter `i_want_a_short_tail`. It tells other functions

that the message should not do as usual and inherit the callstack of the mother message, and instead have no callstack
at all at this point.

# Log

In the base class you have the function `internal_Log`. You can now log things to make it easier to debug your plugin.

The cmd() function and the `internal_Cmd()` function both use `internal_Log` to log what is happening. That means that
your logging should focus on specific things in your code, you do not need to log who is calling who.

Read more about logging in [debug tools](doc,plugin_debug).

# Logging in PHP

When you use `internal_Log` the data are stored in an array. That array is then passed into the response from cmd() in
parameter `log_array`.

The data come to InfoHub Exchange and are sent to `internal_LogArrayToConsole` and each log entry are sent
to `internal_Console`.

In `internal_Console` if your log data is marked as `error` then it is written to `log/log-error.log`.

If the global flag `infohub_minimum_error_level === 'log'` then your log data are also sent to `log/log-all.log`.

The `infohub_minimum_error_level` is set in file `folder/include/settings_and_errors.php` and default is "error", you
can switch to "log" to get everything. Just be aware that the files fill up fast and execution is slower.

# Logging in Javascript

You set the logging level globally in `folder/include/error_handler_and_frame_breakout.js`
in `$GLOBALS.infohub_minimum_error_level = 'error'; // log or error`

Default is errors, you can change to log to get everything in the browser console.

The default values for Log look like this:

```    
{
    'time_stamp': _TimeStamp(),
    'node_name': 'client',
    'plugin_name': _GetClassName(),
    'function_name': '',
    'message': '',
    'level': 'log',
    'object': {},
    'depth': 0, // Used by cmd()
    'get_backtrace': 'false',
    'execution_time': 0.0 // Used by cmd()
}
```

You use the log function like this:

```    
internal_Log({
    'function_name': '', // Name of the function you are in
    'message': '', // The message you want to log
    'level': 'log', // log (default), info, warn, error
    'object': {}, // Optional object you can write to the log. For example $in
    'get_backtrace': 'false' // If level=error then you can ask for logging the call stack
});
```

The log function works the same in PHP:

```    
$this->internal_Log(array(
    'function_name' => 'my_function',
    'message' => 'My message',
));
```

The Log function are used in cmd() and in `internal_Cmd`. In those two places it is not possible to use `internal_Cmd()`
to all `internal_Log`, but in your plugin it is possible.  
Then you do like this:

```    
$this->internal_Cmd(array(
    'func' => 'Log',
    'function_name' => 'my_function',
    'message' => 'My message',
));
```

# Demo

You can see all features of the Base plugin in action if you study [infohub_demo](plugin,infohub_demo).

# Testing

The test function should only be used by the test program.

# Functions in the base class

You can study the base class for PHP and Javascript to find what functions exist. There are comments in top of every
function that explain what it does. It is up to you if you want to use the functions or not.

The goal is that the base class looks the same between cores. The same down to the single code row if possible. The few
changes between the core base classes are extra functions that are frequently needed and provide some kind of
recognition between programming languages.

An example of a function that is used to bring recognition is `_IsSet`. In PHP the command is isset() and in the
Javascript base class you have `_IsSet()`.

Another example is `_Count()`, `_MicroTime()`, `_Empty()`. They are all there so your plugin can be written in both PHP
and Javascript without using special language features.  
[/columns]

# License

This documentation is copyright (C) 2016 Peter Lembke.

Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.

You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2016-03-20 by Peter Lembke  
Updated 2019-07-11 by Peter Lembke  
