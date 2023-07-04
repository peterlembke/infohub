# Nodes
An InfoHub message have a destination: node, plugin, function. This document is about nodes.  

# Introduction
A node is an installation of InfoHub. In many cases InfoHub is a normal web server or a web application and work accordingly.
You can provide information to your installation of InfoHub what nodes it has access to. You give each node a friendly name. That name is the node name you use internally in your InfoHub.  
Now you can send a message from your node to the other node.  

# Node information
Information about nodes are managed in infohub_transfermanager. Here you can add all required information about a node.  
Your friendly name for this node. Domain name on internet. Your login user ID on that node. Your log in shared random data.  
InfoHub Transfer handle all communication. InfoHub Login use the information to log you into the other node.  

# Web node
Nodes that use web technology use https, so your node will need a valid certificate. And you probably want a domain name to that.  

# Message
A message consist of three parts: node, plugin, function. The node is your friendly name of the node. That name will only be used in your InfoHub.
InfoHub Transfer will contact the right server and let InfoHub Login negotiate. Then the messages will be sent to the other node.  
The plugin name is the destination plugin and the function is a cmd function name in the plugin.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-01-18 by Peter Lembke  
Updated 2018-01-18 by Peter Lembke  
