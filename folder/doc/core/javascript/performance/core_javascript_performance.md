# Javascript Core Performance
Things examined to improve performance on the Javascript Core  

# Introduction
Javascript is quick, but the Infohub core does a lot of things. It adds up in time. This document describe what I have done to speed things up.  
But first a reminder of the three lead words: #1 Make it simple, #2 No exceptions, #3 Self containing. This means that we can do
 whatever we want as long as the lead words are fulfilled. None of the lead words say speed.  

# To do
Optimizations that will be implemented  

@todo Update this document 

# Evaluation
Optimizations that are under evaluation  

## step_end (Paused)
If you have a long callstack where each return message has step = step_end, that means the message will be delivered to the plugin and go into the function. There it will find the step_end
 and that step do not exist, it exists with an OK. The answer are sent to the next receiver in the callstack, and once again we enter the plugin and the function to find step_end and send back an OK.  
What if we just cut off items from the start of the callstack if they have step_end?  
The problem with this is that information for from_plugin is fetched from the parent call in the callstack. If that item do not exist then from_plugin will be empty and some plugins really want the information in from_plugin.  
It seems to not be enough to keep one item in the callstack that has step_end  
I have not given up this optimization just yet. It need to mature a bit first. It could probably violate #1 Make it simple.  
    
## Web workers (Idea)
The idea is to start all plugins as web workers. A comment in the code tells Infohub Exchange if the plugin should be started normally or as a web worker.  
The plan is simple: The message are sent to the worker. When the worker is done an event are triggered. The event code takes the out message and put it on the queue for later sorting.  
The gain here is that messages can be handled quicker from the queue. No need to wait for a response. Today with the JS Storage you do not need to wait because it is asynchronous, a callback says when it is finished.  
With web workers all messages would be asynchronous. Too bad then that each message has its own trail with tasks to do. The work can not be split up unless there are messages from different sources where each has its own trail with tasks to do.  
Possible we could use "multiple messages" (See this list). Unfortunately we probably have a bunch of storage writes, that would still queue up at the Storage module.  
I think that Web workers will be a fun exercise to implement but it will violate rule #1 Make it simple, and #2 No exceptions.     
    
# Done
Optimizations that have been implemented  

## Leave the luggage (Done)
When you send a sub call to another node then your call stack are left in the original node and you pick it up when you get back.  
Benefits are much smaller packages with quicker transfer times and less data to transfer.  
The other node can not read and manipulate the stack. Less risk for data manipulation.  

## Service workers (Done)
The new thing is service workers. https://w3c.github.io/ServiceWorker/, The support is https://caniuse.com/#feat=serviceworkers Firefox and Chrome have this. Edge and Safari will get it.  
Here is a guide: https://developers.google.com/web/fundamentals/primers/service-workers/ , and here: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers  
I will implement this because I want to reduce load times and be able to run offline. The first thing I will do is remove all manifest-code.  

## Send less data (Done)
By analyzing responses from the server to the client we can see that the same data exist in both the data and the data/response. It would be better if the client merged the response into the data folder.  
You can see this in the response for getting the startup plugins. The data/plugins is the same as data/response/plugins. It is a list with 21 plugins that average 25Kb each. That is 0,5Mb extra data.  
One solution could be to clean the message before returning it. That could infohub_transfer do. The parameters in data will be deleted if they exist in data/data_back or in data/response.
When the receiver get the messages they will delete data/response/response and data/response/data_back. Then merge data/response into data.
Then delete data/data_back/data_back and data/data_back/response. And then merge data/data_back into data.  

## Startup assets (Done)
When infohub_launcher is started and the assets are missing (icons etc that is on the server in the plugin_name/assets folder) then the assets are downloaded for that plugin. A request are made to the server and the assets are downloaded and stored in Storage.  
When infohub_workbench is started the same thing happens, the assets are downloaded from the server and put in Storage. Remember that each request gives 1 sec of penalty. And that we now add upp to three requests with the plugins and two asset requests.  
It would be great if we could have one request for this. Then we would save 2 seconds in penalty and some time in accessing the server.  
I do not have a solution yet to this, but I think I will do this because the first start should be quick.  

## Startup plugins (Done)
Plugins are downloaded if they are needed and are not existing in the local storage. Each download gives 1 sec of penalty. Since everything is in serial then it takes a log time until the the core and commonly used plugins are downloaded.  
The trick here is include/start.js, it has a list of all plugins we want o be in the local storage. At startup a check is done to see what plugins from the list is missing. Then the missing plugins list are sent to the server. The response are saved in local storage.
Then the plugins on the list are started and the first message are sent.  
    
## `_ByVal` (Done)
A quick function is `_ByVal()`. It is needed to make a copy of an object. Objects are passed to functions by reference so changes in the function affect the object on the outside.
That is why it is so important that every function work on a copy of the object. That is what `_Default()` does by the help of `_ByVal()`.  
I have tried two different methods to copy an object. I have not made any comparisons yet.  
    
## Manifest (Done)
I have tried the cache.manifest to get index.php working offline. The usage of manifest files are deprecated, see [here](https://en.wikipedia.org/wiki/Cache_manifest_in_HTML5).  
The new thing is service workers. So I have deleted everything about manifest from the code. That made the load a little faster.  
    
## Storage - Get final connection (Done)
In the config file you have the connection credentials to the main database connection. If the plugin is not the owner of that connection then a read is done to the database to get a suitable connection.
If a suitable connection is not found then the main connection is used. On the client there is only one database engine: indexedDb. Some day there might be more engines so I want to keep the extra read.
But want if one could say in the config what plugins the main connection should be used for?  
`"used_for": "all", "not_used_for": "",`
These two parameters are not fully developed but used for all is recognized and that can avoid the extra read. Making Storage communication quicker.  
    
## read_many, write_many (Done)
With these functions in the Storage plugin you can read many keys at once and get all results back. You can also write to many keys and get one result back.  
This is already implemented on the PHP version and it will be implemented on the JS version. The gain here is that your code become more simple. The number of calls back and forth reduces.  
    
## Multiple messages (Done)
When you want to send a bunch of messages and you do not care about the answer, then it would be neat to just attach those messages to the return call / sub call and off they go.  
I have done this and it works. There must be a small change in infohub_base and you must use a messages parameter with an array in your return statement.
  
It works, but it gives no performance gain. It both breaks and honors rule #1 Make it simple.
            It breaks rule #2 No exceptions, meaning that you now can return messages in two ways. On teh other hand that rule is already broken since you already can return from a function by callback or return statement.  
I have put the code in a separate branch for later. I might use this since it is a fairly small change and no one have to use it if they do not want to.
            If there were any performance gain and no drawbacks then I will consider putting the code into the main branch.  
I tested this with infohub_asset where I craeted an array with sub calls to infohub_storage write for each asset. I thought that the database would not keep up with the saves until I wanted to read the data.
            But Storage had no problem. The read got the icons to the screen.  
I have implemented this into the master branch and will document how to use.  
    
# Rejected
Optimizations that was rejected  

## Set expiration value on files (Not needed)
Normally you want all browser cached files to have an expiration date so they can be downloaded with a fresh and updated copy in the future. https://stackoverflow.com/questions/4141643/how-do-i-set-expiration-on-css-js-and-images#4141740  
Since InfoHub do not download files the normal way then this is not needed.  
    
# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-03-24 by Peter Lembke  
Updated 2018-03-24 by Peter Lembke  
