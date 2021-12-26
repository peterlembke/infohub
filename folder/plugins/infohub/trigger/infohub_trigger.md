# Infohub Trigger

You as a developer can send messages to your plugin functions with this tool.

[columns]

## Refresh

When you press refresh you contact the server and ask for an updated list with

* list with node names
    * list with emerging plugin names for this node

That data are then used by the client to populate the lists.

An emerging plugin is a plugin you as a developer work on. In _Version you set status = 'emerging'.

## Select a node

Select a node. The plugin list for that node are shown in the next select box.

## Select a plugin

Select a plugin. The function list for the selected plugin are shown in the next select box.

Now the plugin are called, and we pull out the function list. We populate the next select box with the function list.

## Select a function

You can select a function you want to test.

The function are called and the default message are populated.

## Default message

Here you see the default values the function have. You can modify them.

## Select a filter

Here you can select a filter for the response message:

* Get all - get the response unchanged
* No config - filter away the config data
* Bare bone - filter away all unnecessary data

## Send a message

The button will send your message to the function.

The response will be filtered and then shown in the textarea_response.

## Response

Here you will see the filtered response.

[/columns]

## License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2020-08-12 by Peter Lembke  
Updated 2020-08-12 by Peter Lembke
