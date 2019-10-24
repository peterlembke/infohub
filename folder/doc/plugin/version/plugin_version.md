# Version number
How version numbers work  

# Introduction
Each plugin in InfoHub have its own version number. Its purpose its to see how compatible it is with previous versions of the plugin.  

# Version number
The version number is used to see how compatible it is with previous versions of the plugin.  
If the plugin is part of a set with child plugins, then the version number also show if the set is compatible with each other.  
The version number look like this, Example: 1.2.3. The left number is the Major, the middle number is the Minor, the right number is the Fraction.  
The sections can have any large number. 9999.9999.9999 is OK.  

# Date
When you PUBLISH a new version of the plugin, then change the data to today in function `_Version()`  

# Fraction
When you PUBLISH a new version of the plugin and you have done ANY amount of work on it, then increase the Fraction by one.  

# Minor
When you PUBLISH a new version of the plugin where any functions have a changed status, then increase the Minor by one, and then reset the Fraction to zero.  
Read more about function status here: [function status](main,plugin_status)  
This happens when you introduce new "emerging" functions, or change "emerging" to "removed", or change "normal" to "deprecated".  
Removing emerging functions that no one should use is a minor change. Deprecating functions that still exist and work is also a minor change.  

# Major
When you PUBLISH a new version of the plugin where you want to change status on ANY function in the plugin from "emerging" to "normal", or from "deprecated" to "removed".  
In version x.0.0 there are no emerging functions and no deprecated functions. There only exist normal functions and function names marked as removed.  
You need to promote ALL "emerging" functions in your plugin to "normal" or to "removed".  
You need to promote ALL "deprecated" functions in your plugin to "removed".  
Now you can increase the major version number by one and reset the minor and fraction to zero. Example: 1.0.0 or 2.0.0 or 24.0.0 or 567.0.0  
Read more about function status here: [function status](main,plugin_status)  
If your plugin is part of a set with child plugins, then the whole set should have the same new major version. ALL plugins in the set should go trough the same process. This is something that could be coordinated among the developers of the set.  
Removing functions is a major change. Introducing normal functions is also a major change.  

# What triggers what
If you add or remove a parameter to a function then that is a fraction. In other systems that would have been a major but in InfoHub it does not matter much because of the way InfoHub is built. It is up to you to decide if this calls for a fraction update or a minor update. It depends on how important the variable are and if the default value is sufficient for most cases. Just be sure that you update your documentation for the plugin and describe the change.  
If you change/add/remove comments then it might feel like less than a minor change since it is not code, but code is not for computers, it is for people to read, so increase the fraction by one anyhow.  
Remember that the version update occur when you PUBLISH a new version regardless how much work it has been on the plugin. After a sprint you can set the new version number together with your team and decide if it is a fraction, minor or major change.  
Note that the next version number will only have one of the numbers increased by one. Example: 1.2.3 -> 1.2.4 -> 1.3.0 -> 2.0.0  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2017-07-10 by Peter Lembke  
Updated 2018-04-07 by Peter Lembke  


