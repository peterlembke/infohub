![Infohub Logo](https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/welcome/asset/icon/infohub-logo-done.svg)
# InfoHub
- See the [home page](https://www.infohub.se) for more information.

# Your private place on the web
This is not about sharing. InfoHub handle your private data on your own or your friends trusted server.
This is a generic platform where you run your plugins. The long term aim is to create trustworthy operating system in your browser.

# Plugins
You can use existing plugins. You can also easily write your own plugins if you have basic knowledge of a programming language where there exist a core. I have written a core for PHP and for Javascript.
A plugin is one single class that always extend the base class, that is it.

# Lead words in building InfoHub
I refer to these rules every time I am in doubt how to solve something.

**No exceptions**
- Use ONE way to do things, and stick to it.
- For example: ALL traffic go the same way. ALL data are stored in the same way. and so on.

**Make it simple**
- Simple means to write code that everyone can read.
- Simple code often mean fast code. Choose simple over fast but avoid slow code.
- Choose solutions that are simple to understand and simple to implement.
- Let InfoHub stay small, simple and fast. Put new abilities in plugins.

**Self containing**
- A plugin have no dependencies on other plugins. (Learn how dependency free sub calls are done between plugins)
- A plugin can be used outside of InfoHub in any other software project without changes.

# What is this repository for?
- The master branch contain the on going development for the complete InfoHub.
- I set a tag when there is some stable release
- Branch: php-core will contain the minimum required files to run InfoHub on a web server
- There will be other branches

# How do I set it up?
Install a LAMP locally on your machine or run a Docker with LAMP.
Clone this git repository. Surf to your web server.

# Contribution guidelines
Not yet. I have a lot of InfoHub software that I will polish up and release.

# Who do I talk to?
There are no forum yet.

See the [home page](https://www.infohub.se).

# Plans for InfoHub

## Done parts
*  PHP Core
*  PHP Storage
*  JS Core
*  JS Storage
*  Translation system
*  Assets system
*  Documentation system
*  JS rendering system inclusive forms

## Planned parts
*  PHP Login (Working on it)
*  JS Login (Working on it)
*  PHP Plugin test system (Working on it)
*  JS Plugin test system (Working on it)
*  Offline (Some support exist)
*  Translations. Not fully covered yet. English, Spanish, Swedish to start with

## Future plans
I have a long list with features that I might implement in some order
* Encryption - two parties encryption but also single point encryption 
* Web workers - Just because I can :-). InfoHub is so flexible.
*  

## Bad ideas
I also have a long list with bad ideas and why they are bad for InfoHub.
