# Offline
What Infohub means about offline is when you do a subcall to a node and it is not answering within 5 seconds then it is considered offline.  
 
# Infohub_Transfer
Infohub_Transfer keep track of what nodes are offline.  
If a node is offline then all subcalls to that node are answered with an offline message.  
All other messages that are answers from the other node will remain there until the node is online again.

Infohub_Transfer will try to contact that node again after 3 minutes and will do three tries until the rest of the messages are deleted too.
         
# browser online
The browser has an event that detect if you are online or not. Meaning if you can reach the internet.   

* It can detect if you put your brower in offline mode. 
* It can detect if you lose internet connection in your WiFi. 
* It can not always detect if you pull out your ethernet cable. 
* It can not detect if the destination node will answer or not.  
* It can not detect if we really need an internet connection to reach the node.
* The function is not present in other systems like in PHP.

I will not use this function and instead remember if the node answers.    

# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2019-06-16 by Peter Lembke  
