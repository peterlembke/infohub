# Infohub Demo Storage

Show all features in Storage on client and server

# Introduction

In this demo we show how to use  [Infohub Storage](plugin,infohub_storage).

You will read a path, write to a path, read to many paths with different data, write to many paths with different data.

And we also have "mode". Default is to overwrite but you can set to merge.

## GUI

Two sections

* Write
    * Node - Dropdown
        * Client
        * Server
    * Mode - Dropdown
        * Overwrite
        * Merge
    * Path - Dropdown
        * infohub_demo/storage/a/test1
        * infohub_demo/storage/b/test2
        * infohub_demo/storage/b/test3
        * infohub_demo/storage/c/test4
        * infohub_demo/storage/b/*
        * All four
    * Data - Dropdown
        * Adam, { 'first': 'Adam, 'last': 'Andersson' }
        * Bertil, { 'first': 'Bertil', 'last': 'Bengtsson' }
        * Cesar, { 'first': 'Cesar', 'last': 'Carlsson' }
        * Flag true, { 'flag': true }
        * Flag false, { 'flag': false }
    * Write - Button
* Read
    * Node - Dropdown
        * Client
        * Server
    * Path - Dropdown
        * infohub_demo/storage/a/test1
        * infohub_demo/storage/b/test2
        * infohub_demo/storage/b/test3
        * infohub_demo/storage/c/test4
        * infohub_demo/storage/b/*
        * All four
    * Read - Button
    * Data - Textarea

## Logic

Write:
Set the "mode" and the "path" and the "data" - Press button. Send to "write" except if "Path" = "All four" then send to
write_many

Read:
Set the "path", press the button. Show the data in the textarea.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2020-06-19 by Peter Lembke  
Updated 2020-06-19 by Peter Lembke  
