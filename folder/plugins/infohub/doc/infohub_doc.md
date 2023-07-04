# InfoHub Doc

Here you can read all documentation. The general documentation and documentation for each installed plugin.

## Introduction

You can document your plugin in a simple Markdown format.  
The documentation file for plugin infohub_doc is called infohub_doc.md and is placed together with the plugin code. The
content of the file is plain text and based on Markdown.   
Other examples: infohub_demo.md, infohub_callback.md

## Why should I document?

When you document a plugin you give others a chance to understand how the plugin should be used.

* For a plugin to be accepted in the test program there must be a documentation file, or else the plugin is considered
  being incomplete.
* If the programmer did not bother writing a documentation file for a plugin, why would you then bother running the
  plugin on your site?

## How do I document

You can see how all the plugins are documented with a file that has the same name as the plugin and a file name ending
with .md that indicate the file is written in the MarkDown format. Markdown is a plain text file where you write ina
specific way that the computer can read.

Read more about the [GitHub Markdown flavor](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
Read more about the [InfoHub document format](plugin,infohub_renderdocument)

You write in Markdown format but for InfoHub to correctly handle event links and images I needed to modify how some
things are written.

### Special for infohub_doc

There is one speciality for infohub_doc when you write navigation links.

This:

``` 
Read about [infohub_base](plugin,infohub_base)
``` 

Will be substituted with this:

``` 
Read about [infohub_base](infohub_doc|click_link|plugin,infohub_base)
``` 

Result:
Read about [infohub_base](plugin,infohub_base)

Use the first shorter form.
(plugin,infohub_base)

* plugin is the area. You can have plugin or doc
* infohub_base is the document name. Can be a plugin name or a document name from the doc folder. Example:
  main_vision_applications

## Usage

When you start infohub_doc you will see two buttons "Refresh Navigate", "Refresh Index".

### Navigation

Click on the button "Refresh Navigate" to update the list with available documents you can view. You can now click on a
document name, and you can expand nodes by clicking on the + and -. When you click a document name the document will be
viewed.

### Index

Click on the button "Refresh Index" to update the index for the currently viewed document. You can then click in the
index to scroll to that section in the document.

### View document

Now you see the document and can read.

## Developer

This section is only interesting for developers.

### infohub_doc.php

The infohub_doc.php plugin give you the data.

* get_document - download a document with image data embedded
* get_documents - download many documents
* get_documents_list - get a full list of all available documents

#### get_document

You give a document name and checksum if you have.  
The item you get back is shown below. If the checksum is still valid then the item will only have data in name and
keep_existing.

The item contain

* name - The name path with underscores like plugin_infohub_doc_index or document_node_client
* content - The document with embedded images
* checksum - MD5 of the content with embedded images
* title - The first h1 in the content
* provided_checksum - the checksum you provided
* keep_existing - "true" or "false"

#### get_documents

Same as get_document, but you provide an array with document name and checksum if you have.  
Calls get_document for each provided item. The result will be the same as get_document but in an item array.

#### get_documents_list

Return a list with all document names.  
If you already have a list then give the checksum of that list. You might get a "keep" response.  
The list contain all items found on the server in all areas. The list item keys are "name" and they are sorted
alphabetically.

The key is "name" - The name path with underscores like plugin_infohub_doc_index or document_node_client

An item contain:

* checksum - MD5 of the content with embedded images
* title - The first line that start with #

### infohub_doc.js

The client Javascript plugin that is the umbrella for the child plugins.

Functions

* create - Used in rendering a document, navigate, index, visited list
* set up_gui - Creates the boxes and calls the children to render their content in each box.
* click - All gui clicks comes here and are distributed to the right child plugin and function.
* call_server - Used by the children to call the server.

#### create

Used in rendering part of the gui. You can render

* navigate
* document
* index
* visited

#### set up_gui

Creates the boxes and calls the children to render their content in each box.  
Calls: navigate, document, index, visited

#### click

All gui clicks comes here and are distributed to the right child plugin and function.

#### call_server

Used by the children to call the server. All children can contact all level1 plugins.  
This function can only be used by its own children.

### infohub_doc_navigate

Renders the navigation tree. When you expand a node then that part is rendered.  
When you click a document name then that document is rendered.

Uses infohub_doc_get -> get_documents_list to get the data needed for the list.

### infohub_doc_document

Render one document. Fetches the document from infohub_doc_get.

### infohub_doc_index

Parses the document content for headers #, ##, ###, #### and create a clickable list. You can now navigate in the
document and jump to each title in the document.

### infohub_doc_visited

This is *not* implemented yet. Handles the list with the 16 latest visited documents and their metadata.

add_document - Add a document to the list and get the current list get_list - Get the list

#### add_document

If the document do not exist in the list then add it at the top and remove the last item. If the document exist in the
list then remove it and add it to the top. Save the list in Storage.

#### get_list

Get the list from Storage.

### infohub_doc_get

The other sibling plugins use infohub_doc_get to get the data they need.

If infohub_doc_get have the data then it will be given to them. If infohub_doc_get do not have the data then it will ask
the server and then give to them.  
If infohub_doc_get do not have the data, and we are offline then a false will be returned. Old data does not matter, the
sibling will get the data we have. Then infohub_doc_get will try to update the local data by asking the server.

#### get_document

Used by infohub_doc_document to get a document to view.

#### get_documents_list

Used by infohub_doc_navigate to get the raw data for the list to render.

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License,   
Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover
Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation.   
If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2019-04-17 by Peter Lembke  
Updated 2019-05-26 by Peter Lembke
