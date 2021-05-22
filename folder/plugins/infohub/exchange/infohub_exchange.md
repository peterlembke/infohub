# Infohub Exchange

Your local message router

# Introduction

When Infohub get a package with messages the messages arrives to Infohub_Exchange for sorting. There are several message
queues the message will pass trough on its way to the destination.  
Responses from plugins also goes into the queues and are rerouted to its destination by Infohub Exchange.

# Pre-sorting

Each message in the incoming package must pass trough some strict checks.  
If the package contain more than 20 messages then I will throw away all messages. Because all nodes know this rule and
should not send more messages than this.  
Each message are now checked. It must have the right structure. It must come from a known node. It must follow the rules
whom it is allowed to call.  
The final destination for this message must be this node, I do not allow messages to just pass trough. A package always
come from another node, therefore if a message in the package claim to be from this node then it is obviously not true
and the whole package will be thrown away.

# Rules for calling

You can talk with yourself. infohub_storage -> infohub_storage  
You can ANSWER your parent. infohub_storage_mysql -> infohub_storage  
You can talk with your children. infohub_storage -> infohub_storage_pqsql  
You can talk with your siblings. infohub_democall_child -> infohub_democall_sibling  
You can talk with any level 1 plugin in the same node.  
Level 1 plugins can talk to level 1 plugins in other nodes. For practical reasons a server node can not talk to the
client node. That might change in the future if I overcome the technical obstacles.

## Why these rules

These rules exist for security reasons to bring order into the message flow. The message flow are easier to understand
with clear rules.  
The rules gives you full control over the messages between your plugin children so you can do any changes you want
between your parent plugin and all your children.  
It also give you ONE interface to a plugin that has children, since you now know that you can only call the parent and
then the parent talk to its children.

# Sort

This step sort all incoming messages that come from an external node (package) or from internal plugins.  
If the message go to another node then it is put in queue: ToNode[{nodename}].  
If the message go to a plugin in this node then check if the plugin is started, if it is NOT started then the message go
to queue: ToPending.  
The rest of the messages will go to a plugin in this node and the plugin is started, the message will be placed in
queue: Stack.

# ToPending

This step sort all messages in queue ToPending. The messages wait in this queue because the destination plugin was not
started. Pending is an array with plugin names, each plugin name have a sub array with messages that will go to that
plugin.  
If Pending have the plugin name but no messages, then it means it have previously got information that it will never
come a plugin with that name and have thrown away all pending messages to that plugin. We will now throw away the
message.  
If Pending already have one or more messages to this plugin then this message are added to the queue.  
If Pending do not have this plugin name stored, then it stores the plugin name and the message, then makes a subcall to
infohub_plugin and its function: plugin_request

# plugin_request - plugin_started

Read more about this function in Infohub_Plugin. It gets the request from Infohub_Exchange, finds the plugin if
available. If it is a server plugin then it is started.  
Infohub_Exchange get a subcall to plugin_started with information about plugin_name and plugin_started=true/false. Now
it can take care of the messages in queue Pending.  
If plugin was NOT started then delete all messages for that plugin_name but leave the plugin_name in Pending. This means
that we got word that it will never come a plugin.  
If plugin was started, then transfer all Pending messages to queue Stack and remove the plugin name from Pending.

# Stack

This step run each message in its plugin, and places the answer in queue Sort.  
Before the plugin is called, the configuration is loaded from file or localStorage, and the configuration is added to
the message. You can then add the 'config' array parameter to your $default and use the config in your function.  
The log array are sent to console. The errors are then pulled out and kept in the message in error_array for future
reference.

# Transfer

When all messages in all queues have been handled, then a final transfer message are added to Sort. It is a subcall to
infohub_transfer to send all outgoing messages to their destination nodes.  
Messages to the client will be echoed to the screen.  
Now all tasks are done and infohub.php have nothing more to do and will exit.

# Demo

You can see all features of the Exchange plugin in action if you study infohub_demo.

# Configuration

You can have a JSON file in each plugin folder. That JSON can contain configuration for your server node and your client
node.

You can see examples of this in infohub_exchange.json and in infohub_storage_data.json  
Use by adding "config": {} to the default values in your client cmd function. Use by adding "config" => array() to the
default values in your server cmd function.

Your server plugin will only get access to config data in the server section of the file. Your client plugin will only
get access to the config data in the client section of the file.

Why do this feature exist? Should not all data be stored in Storage? Yes all data should be stored in storage. There are
just two problems with that, first we have the rule "Be self sufficient" - not to be dependent. And we also have the
problem that core plugins sometimes need the data before Storage is available.

There can also be other considerations like that data is needed on every call but could be changed, like in the case
with infohub_storage_data.json where the login credentials for the database is required in each call.  
The config file is NOT for default values. Default values should be part of the code. The config file is NOT for data
that you could store in Storage instead. There are only some rare cases where the config file is a good thing.

When should you use a config file:

- You have read-only data that seldom change
- Some of the data are needed in every call
- It is not much data, less than 10Kb for each node

It is not a big deal to start out with a config file and then if you later see that you should have used a Storage
instead, then you just swap to Storage.

## Override configuration

If you need to change a configuration file then you copy it to folder/config and do the changes there.

If a config json file exist in folder/config then it is used INSTEAD OF the original file.

# Domains start message

When your browser get the plugin code from the server you also get the config file data. infohub_exchange.json contain
start messages for different domain names.  
In the example below you see domain names and their start messages. Remember that you also need to define your domain
names in the HOSTS file in your system, and set up VHOST in your web server.

```
{
    "client": {
        "domain": {
            "default": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "www.infohub.se": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "doc.infohub.se": {
                "node": "client",
                "plugin": "infohub_standalone",
                "function": "startup",
                "data": {
                    "plugin_name": "infohub_doc"
                }
            },
            "demo.infohub.se": {
                "node": "client",
                "plugin": "infohub_standalone",
                "function": "startup",
                "data": {
                    "plugin_name": "infohub_demo"
                }
            },
            "local.infohub.workbench": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "local.infohub.doc": {
                "node": "client",
                "plugin": "infohub_standalone",
                "function": "startup",
                "data": {
                    "plugin_name": "infohub_doc"
                }
            },
            "local.infohub.demo": {
                "node": "client",
                "plugin": "infohub_standalone",
                "function": "startup",
                "data": {
                    "plugin_name": "infohub_demo"
                }
            },
            "local.infohub.random": {
                "node": "server",
                "plugin": "infohub_random",
                "function": "random_number",
                "data": {
                    "min": 1,
                    "max": 100
                }
            }
        }
    },
    "server": {}
}
```

Exchange will match the URL address and see what start message to send. You can have any node, plugin, function in the
message. In the last row for local.infohub.random you will only see the response in the browser developer tools network
tab. It will give you a server response with a random number.

Plugins with a graphical user interface can not just be called directly because some boxes need to be setup first. Then
you call infohub_standalone and tell what plugin should be run.

The normal start is to call infohub_workbench.

With this you can see that the same Infohub can be used for presenting totally different web pages.

# License

This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2016-03-31 by Peter Lembke  
Updated 2019-11-09 by Peter Lembke  
