# InfoHub Tools

Small tools that might be useful

# Introduction

With Tools, you have an example of a plugin that uses multiple screens and render them on demand. There is a slight wait
the first time you use a tool. That is because the plugin must be downloaded from the server. The second time the plugin
is in your browser already and all render quick.  
You can read all about the tools in the child documents

# Tools as a useful demo

The tool you see is the graphical user interface. When you press the button then your input data are sent to the right
plugin. That plugin can be in your browser or the message goes to the server.  
Asking the server is always slower. And InfoHub also add a second ban time to each correct request. Your browser keep
track of this ban time and put all outgoing messages into a queue.  
Start any of UUID, Time, Random, Password. They are all designed, so you can ask the server for the data, and you will get
all results in a text box.  
Now press the button quickly several times and note a slight delay before several responses show up in the text box.  
If you are a developer you can check the requests from your browser and see that there are multiple messages in one
request.  
You can now switch to get the result from the client. The data show up immediately and there are no requests to the
server  
This shows that InfoHub are designed to reduce the number of requests to the server.

# Future

There will probably be more tools in here in the future when plugins are added and need a GUI.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Updated 2018-09-14 by Peter Lembke  
Created 2018-09-14 by Peter Lembke  
