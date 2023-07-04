# InfoHub About
InfoHub is a generic platform that run your plugins. You can quickly take the template plugin and create your own plugin in minutes. You can download and use ready-made plugins or easily modify them to your liking.
Use your favourite programming language. Download a core for your language and start coding. If there is no core to download, then create one by translating from another language.   

# The generic web platform
A platform take care of all the stuff that you know you need but would take ages to write. 
There are many popular platforms, here are a few popular ones: Magento, WordPress, Joomla, Drupal. 
They are targeting different areas and can be expanded with modules. InfoHub is a generic platform. 
It does nothing until it gets some plugins that tell it what to do. There are some demo plugins included.  

# Getting started
[GPL 3 licensed](main,license). No costs for you to get started. Just download and install. 
InfoHub installation is simple, copy very few files, and you are on.  

# You can write plugins
Plugins are simple to create, copy the infohub_plugin template to a new name and start coding.You can write javascript plugins for the client and php plugins for the server. The way you do it is identical and works identical.   

# Independent plugins
Each plugin is just one file, one class, and they all extend the base class.Each plugin can be used independently in another environment if you like. 
Give an array to the plugin, the plugin handle the array and spit out an array with the answer.   

# Message flow
InfoHub Exchange take care of the messages between the plugins. Messages are sent between the client and server without any effort. 
You can do a sub call from and to any node. Nodes are the client, the server and other InfoHub servers that got node names. 
Each message contain its own call stack and can find its own way back to the caller.  

# Automatic plugin start
If a message goes to a plugin that is not started then it is put aside and the plugin is requested. 
When the plugin have started then the messages to that plugin come back in the flow.  

# Logging
You can enable logging in the plugin configuration, then the server logs data to files and the client logs to the console. 
The console messages are a great source for finding errors. You do not have to add any logging commands to your code. 
That is taken care of by the caller functions Cmd() and internal_Cmd().  

# Caller functions
Each plugin have only one public function: Cmd(). The message goes into that function, and it calls the right cmd function. 
You will get an array back from Cmd with the answer. 
The Cmd function take care of logging, error handling, measure execution time, check the incoming variables in the array, returns a return-message or a sub-call-message.  

# SubCall or Return message
A plugin always return a valid message that can be released to the flow. The message is either a return message, or a sub-call message. 
You can do a sub-call in your function to anywhere and then expect the very same function to get a return message with data. 
You can attach variables in the sub call that will return untouched. See the demos for a "step"-variable.  

# Strongly typed
PHP and Javascript can do type-juggling without saying a pip. That is great. 
A great source of agony is when you can't find where it has type-casted and destroyed your data. 
Each function in every plugin start by setting default values. 
Now you know that the incoming array contain what you expect and nothing more.  

# Renderers
You give an array to a renderer. The array tells what you want to display and where you want to display it on the screen. 
The renderer create the HTML and send it to the viewer. 
The viewer create display boxes and make sure there are no duplicate IDs. 
There are ready to use renderers for text, maps, images, lists, audio, video, links, forms. 
You can write your own renderers, they are just normal simple plugins.  

# Responsive display
You can zoom in, zoom out, and resize the window. The same view displays readable on HD screens all the way down to smartphones with small screens.  

# Kick out tests
InfoHub would just love to kick you out with your ass first. Every call you make must pass the quick tests. 
There is a ban system that always give you 1 second ban time for a valid call, and more for an invalid call. 
The tests are in index.php and in infohub.php.  

# Automated tests
An InfoHub plugin get data from an array and give an array back. There are no other sources of input or output. 
The test system ask the plugin what functions it has and then call each of them. 
The function use the default values and give back the default answer. 
The arrays are saved in a test file for each plugin. In a future release I will also save live data to the test system.  

# Multi domain
One website can have multiple domains and subdomains. You define in a configuration what start message should be sent for each domain. 
There is a default fallback. You can then get different contents for each domain.  

# Universal storage
You can store anything. Send a message to Storage to read/write. Storage then use well known SQL server brands to store the data.  

# Localized
You can store data in a way that the text or audio are always picked in your preferred language.  

# Accessible
The target platforms are only: TOUCH and KEYBOARD. You can navigate solely by touch and/or keyboard if you want to. 
The mouse is just a substitute for touch. That means we never use mouse hover or overlays. 
Pick your preferred colors, font and zoom level. That is then used on all InfoHub sites you visit.  

# Easy log in
Login by scanning a QR code with your phone.  

# Lead words in building InfoHub
These three rules apply in all decisions about InfoHub.  

## 1, Make it simple
- If you have to choose between simplicity and speed then choose simplicity.
- Choose solutions that are simple to understand and simple to implement.
- Prefer solutions that already exist in InfoHub so that you easily recognise them.
- Simple means to write code for humans, code that everyone can read.
- Write code with precise naming and consequent structure, avoid comments in the code.
- Let InfoHub stay small, simple and fast. Put new abilities in plugins.

## 2, No exceptions
- There should be no exceptions. Meaning that your plugin does as all other plugin does. That makes it easier to learn.
- Means that ALL data are stored in Storage. ALL traffic are exchanged between plugins with InfoExchange.
- EVERYONE have to do a log in to access data. ALL data in/out from the node are handled by InfoHub Transfer.
- Do not introduce surprises, that would break rule #1

## 3, Self containing
- Try to have zero or few sub calls to other level 1 plugins. This means that your plugin should focus on solving a specific problem.
- Small internal functions that you can copy to your plugin is better than external sub calls.
- It is easier (see #1) to follow internal sub calls.
- Your plugin must handle a rejection from each sub call.
- Your plugin can be used in other none InfoHub projects with no changes.
- Self containing also mean that your plugin is distributed with a good documentation file, test data file, all assets, default config and so on, so you do not have to search for more information.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-03-31 by Peter Lembke  
Updated 2021-08-28 by Peter Lembke  
