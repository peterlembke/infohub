# Make plugins
How to create your own plugins.  

# Introduction
This section is about how to make a plugin for InfoHub.  
If you want documentation for existing plugins then look here: [Documentation for installed plugins](plugin,plugin)  

# The template
There is a plugin template that you copy, rename and start writing your code in. It is the same template regardless of what your plugin will do.  
Read more how to use the template here: [InfoHub Template](plugin,infohub_template)  

# The base class
All plugins in InfoHub is always extended from the base class. That combination is called a plugin.  
Learning about the base class is very important: [InfoHub Base](plugin,infohub_base)  

# Renderer - Plugin that create part of the GUI
A renderer is a plugin that are used to render part of the graphical user interface (GUI).  
The renderer work close to where the result should be used. For example, all renderers are run on the client and none are run on the server.  
There are built in renderers as child plugins to [InfoHub Render](plugin,infohub_render), but you can also create your own renderer. See [InfoHub Rendermajor](plugin,infohub_rendermajor) and [InfoHub Renderadvancedlist](plugin,infohub_renderadvancedlist)  
See here how to build your own renderer [Plugin Render](doc,plugin_render)  

# Workbench - Plugin that has a GUI
If you create a plugin that should be started from Workbench and have a graphical interface, then you can have a look at how it is done in [InfoHub Doc](plugin,infohub_doc).  
You can also read a bit more about this in [InfoHub Workbench](plugin,infohub_workbench)  
See here how you add a GUI to your plugin: [Plugin GUI](doc,plugin_gui)  

# Automated tests
Test your plugin with automated tests,  
Here you can read about the test program [InfoHub Test](plugin,infohub_test)  
See here how testing works: [Test](doc,test)  

# Release your plugin
Before you release your plugin you need to know about [function status](main,plugin_status) and about [plugin version](main,plugin_version).  
You also need to know about licenses, read here: [Licensing](main,license)  
And you should also know that others are reviewing your code so please take a look here for recommendations: [Plugin recommendations](plugin,plugin)  
See here how you can release your work: [Plugin Release](doc,plugin_release)  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Updated 2017-07-10 by Peter Lembke  
