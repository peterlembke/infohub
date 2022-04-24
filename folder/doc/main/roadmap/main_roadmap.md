# Road map for InfoHub
What to focus on in what order

You can find the releases [here](https://github.com/peterlembke/infohub/releases). 

I also have a list with [planned parts I am working on](https://github.com/peterlembke/infohub#planned-parts-i-am-working-on) and [future plans](https://github.com/peterlembke/infohub#future-plans).

This road map is about the [future plans](https://github.com/peterlembke/infohub#future-plans) for the Infohub domain. Planned milestone versions and when I aim to release them. 
This also means that I can release applications ^^^for^^ the Infohub platform in separate domains and repositories. 

Releases that do not contain any milestones have a smaller number like version 1.2.6.
Smaller versions can still contain a lot of new things but are not considered a milestone for Infohub.

Here are the short term plans for Infohub:

# Tree
The Tree is the most important plugin in Infohub. It handles encryption and storage of your data locally and synced to the server.
Local plugins use the Tree plugin for all private data and do not talk with the server directly. 

For: Javascript

# Darkhold
You can send tail-less messages if you do not need the answer.
If you want to send many messages and assemble all answers you need the Darkhold feature.
Darkhold will also make it more efficient when I implement multi threading later with Swoole and Web workers.

For: PHP

# Translate
New simple way to support a lot of languages with LibreTranslate.
Darkhold PHP is required to make this work.

For: Javascript and PHP

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-04-17 by Peter Lembke  
Updated 2021-12-26 by Peter Lembke  
