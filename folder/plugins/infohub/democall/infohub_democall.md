# Infohub Democall

What happens if we do a bad call

# Introduction

You can call a node, plugin, function and that will run the function. The answer is returned to your function. But what
happens if the function do not exist, or the plugin do not exist?  
With democall you can test just that with calls to the client and to the server.  
Who can call who? DemoCall also test if you can send a message to plugins that are self, child, sibling, parent, sibling
child, level1. The rules are described in [Infohub Exchange](plugin,infohub_exchange)

# Rules

If you call a missing plugin or a missing cmd function then you get a message back with answer = 'false' and a message
that the plugin is missing. It really does not matter why it fails.  
If you call an internal function, and it does not exist, then you get answer = 'false' and a message that the function is
missing.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2018-05-19 by Peter Lembke  
Updated 2019-03-11 by Peter Lembke  
