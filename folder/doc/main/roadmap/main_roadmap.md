# Road map for InfoHub
What to focus on in what order

You can find the releases [here](https://github.com/peterlembke/infohub/releases). 

This road map is about the for the InfoHub domain. Planned milestone versions and when I aim to release them. 
This also means that I can release applications ^^^for^^ the InfoHub platform in separate domains and repositories. 

Releases that do not contain any milestones have a smaller number like version 1.2.6.
Smaller versions can still contain a lot of new things but are not considered a milestone for InfoHub.

Here are the short term plans for InfoHub:

# Version 1.3.x

Main goal for v1.3.x is the Tree feature. I need to fix the translation support and batch messages.

## Batch messages - released in 1.3.30
You can send tail-less messages. They come back to you but there it stops. They do not have the full call stack.
The last of those messages will have a flag, so you know you got all the messages back.

Practical example: See Translate below.

For: PHP, Javascript

## Translate - future version 1.3.40
New simple way to support a lot of languages with a local copy of LibreTranslate.
"Last message" is required for this to work.

How it works: The translation file is in english. An API call to LibreTranslate only allow a certain data size.
The wanted translations are chopped into smaller pieces and sent to LibreTranslate.
Each answer will be saved to Storage.
The last message will have a flag that it is the last message. Now we can read all translations from Storage and create the translation file.

The Translate plugin also have a lot of bugs to fix.

For: PHP

## Tree - future version 1.3.50
The Tree is the most important plugin in InfoHub. It handles encryption and storage of your data locally and synced to the server.
Local plugins use the Tree plugin for all private data and do not talk with the server directly. 

For: PHP, Javascript

# Version 1.4.x

Things that are easy to implement but give big impact on the platform. 

## New features

Storage MongoDb - I have worked a lot with MongoDb and would say it is the goto storage solution in all situations.
Storage Redis - In memory storage can be good for caches, batch messages temporary storage, user sessions.
Storage File - When you have only a web server, you should still be able to use Storage.

## Improvements

Storage - Connection manager, read/write traditional tables that already exist and have one unique key field. 
Workbench - Workbench lack some features and could be more intuitive with favorite stars, show version, big icons instead of buttons but keep the translated texts.

## Bug fixes

Tools - A lot if small issues. Need design improvements on some GUIs.
Demo - A lot if small issues. Need design improvements on some GUIs.

## Version 1.5.x

Event/override system in Javascript and PHP.
Improve working offline.

## New features

Event system - Subscribe to specific incoming/outgoing messages
You can get a copy, or you can intercept a message and be able to modify it.
That means we have both an event system and an override system.

## Improvements

Offline - Make it even easier to work offline. It works today. 

## Bug fixes

Offline - Progress bars do not work. I can not get them to work just yet. Need an event system.
Various bug fixes.

## Version 1.6.x

Connectivity to other systems.

## New features

Call other Infohub servers. PHP only.
GUI to manage login accounts to other systems. JS

Call other APIs. PHP only. Call REST and GraphQL APIs.
Design so you can send messages as usual to another infohub node and get answers.
GUI to add credentials and to map functions.
Set up worldtimeapi.
Let infohub_time.php send messages to worldtimeapi and get data.
infohub_time.js - Use the new functions in infohub_time.php

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-04-17 by Peter Lembke  
Updated 2024-05-20 by Peter Lembke  
