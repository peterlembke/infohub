# Investigate composer
Should InfoHub use Composer for managing plugin versions?
Or should InfoHub continue on the vision where we walk away from traditional files.

## What is Composer?
Composer is the PHP package installer. In the root we have a composer.json that tell what packages to install and what versions of those packages.
You can state a specific version or a range of versions.

A package has its owh composer.json with requirements. Composer install those too.
You can only have one version of a package installed. Composer find the optimal version that is acceptable for all other packages.

With Composer, we have a working system for installing PHP packages.  
The system is standard in the PHP world. Many PHP developers have worked with Composer.

## InfoHub Vision
InfoHub is not a normal PHP project. I try to do something new that give more benefits, not more of what already exist.

My vision for InfoHub is to move away from files. Want to pull plugins from file, Cache, Storage, Web services.

Imagine you have all code, all active code versions, all code languages, all assets with images and translations, all metadata - all in one searchable SQLite file.
And that data can then be transferred into any kind of Storage.

If a plugin is missing then it could be automatically installed from another InfoHub server that has a signed copy, or from WebRTC where another browser has a signed copy.

No need to update dependencies. All happens when a plugin get a message and the plugin do not exist.

With the rendering engine where everything is rendered in the browser we define the full interface in arrays. These arrays can be stored in the database and be easily edited and transferred to other browsers.
Means that a tool that design graphical interfaces can be used. The data stored as metadata in the SQLite file etc.

## Benefits with Composer in InfoHub

* No need to invent things that exist and work well and developers use.  
* Bitbucket and GitHub both allow unlimited public and private repositories.
* Each plugin would get its own repository.
* Core become smaller.
* Each repository become more important with its own agenda.
* A small core makes it easier to port InfoHub to other platforms like Python.
* I can depend on one plugin in my composer.json to get many plugins installed.
* It is easier to use and update 3rd party packages in InfoHub and create wrapper plugins for them.
* It is easier to use InfoHub packages in other systems like Magento2, Joomla!, Laravel.

## Drawbacks with Composer in InfoHub

In normal PHP projects there are no drawbacks with Composer. It is a good choice in projects like Magento2 and Laravel.  

* Composer is a system for PHP packages. It can not be used for Python packages.
* A lot of work to change to composer, so I must be sure before I start the work. 
* Finding classes to load become harder. See below in `folder structure`.
* Composer automatic loading only support files.
* Becomes dependent on GitHub, Bitbucket, Composer. 
  * They can change terms, do major changes, be unavailable
  * You can be thrown out of their services 
* You need Internet and you will install files

## Benefits with Composer in InfoHub - shoot them down
Here I will try to shoot down the benefits.

* No need to invent things that exist and work well and developers use. 

No need to blindly use things that goes against my vision for InfoHub. 


* Bitbucket and GitHub both allow unlimited public and private repositories.

Whatever they decide for the moment. 

* Each plugin would get its own repository.

Can still happen even without Composer. For practical reasons.

* Core become smaller.

Core can still become smaller.

* Each repository become more important with its own agenda.

That is an opinion.

* A small core makes it easier to port InfoHub to other platforms like Python.

A good documentation is even better. And that documentation of the coee exist.

* I can depend on one plugin in my composer.json to get many plugins installed.

The vision state that a plugin will be requested if needed. So not mass-installations are needed.

* It is easier to use and update 3rd party packages in InfoHub and create wrapper plugins for them.

3rd party plugins should not be used in InfoHub. Each package would have to be validated to be secure.

* It is easier to use InfoHub packages in other systems like Magento2, Joomla!, Laravel.

It is better to let InfoHub run separately and send messages to InfoHub just like the JS Core does to the PHP Core.
Then it is possible to treat InfoHub as a web service and mix different languages.

## Drawbacks with Composer in InfoHub - shoot them down
Here I will try to shoot down the drawbacks.

* Composer is a system for PHP packages. It can not be used for Python packages.

Composer can handle all kind of files. But the class automatic loader is for PHP. 

* A lot of work to change to composer, so I must be sure before I start the work.

Agree.

* Finding classes to load become harder. See below in `folder structure`.

By using the Composer automatic class loader then that takes care of it all.

* Composer automatic loading only support files.

Yes, but does InfoHub have to have its vision?

* Becomes dependent on GitHub, Bitbucket, Composer.
  * They can change terms, do major changes, be unavailable
  * You can be thrown out of their services

Everyone is dependent on something. It works as it is today with Composer.

* You need Internet and you will install files

Files is not bad. And internet is everywhere now.

## Execution to Composer
How would it be possible to introduce Composer into InfoHub?

* Add README.md, composer.json, LICENSE.md, CHANGELOG.md to each plugin folder
* Create a `src` folder.
* Put source code in the `src` folder.
* Put `asset` outside of the `src` folder.
* Add a `releases` folder to each repository. With detailed release files
* Create a repository for each plugin and commit the plugin
* Create a version tag in each repository
* Change the PLUGINS constant from `folder/plugins` to `vendor/`
* Put dependencies in the composer.json, depend on infohub_core
* Put the loading of files to a central function. Use this function where needed.
* Create `infohub_core` that contain a composer.json that depend on all core plugins. Then I can change core plugins in one place.
* Keep `folder`. Keep the plugin structure.
* Put the documentation in the infohub_doc plugin and change the DOC constant

## Folder structure with Composer
This would be the expected folder structure if we use composer on InfoHub.
To find the infohub_demo I would need to check `vendor/composer/installed.php` and find it under `peterlembke/infohub_demo`.
Then get the `install_path`, and add `src`.
If I want to reach a subclass like infohub_demo_audio.js then I need to pull out `audio` and add that folder and then I will find the files.

* vendor
  * peterlembke
    * infohub_demo
      * asset
        * icon
        * image
        * translate
        * launcher.json
      * releases
      * src
        * audio
          * infohub_demo_audio.js
          * infohub_demo_audio.md
        * infohub_demo.json
        * infohub_demo.md
        * infohub_demo.php
        * infohub_demo.js
      * CHANGELOG.md
      * composer.json
      * LICENSE.md
      * README.md

Today when I want to find a class I do like this:

**Plugins: js, php, md, json**
```
$fileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.json'; 
```

**Assets:**
```
 $path = $this->pluginPath . DS . strtr($pluginName, ['_' => DS]) . DS . 'asset' . DS . 'launcher.json';
```

## Insights
My vision with InfoHub have woken up again.   
I want the PHP Core to work just like the JS Core works where it finds a plugin and asks for a plugin from the server.
Some additional files are good to have in each plugin.  
I need to investigate where the paths are created and how the files are read.  

## Conclusion

I will not use Composer for InfoHub. The consequence is that InfoHub plugins can not be used in Laravel or Magento2.  
I can write a PHP package that connect to InfoHub servers. Then M2 and Laravel can talk with InfoHub servers.  
Not using Composer also means that I need to provide another way to install software, but only just before software is needed.  

## Actions

* [X] Add LICENSE.md to each plugin. No, I have a PHPDOC header in each class
* [X] Add a README.md to each plugin. No, there already exist a Markdown in each plugin folder
* [ ] Add CHANGELOG.md to each plugin, only when needed
* [ ] Investigate where plugins, assets, docs, config are read
* [ ] Have infohub_file to also construct paths for plugins and assets

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2021-12-31 by Peter Lembke  
Updated 2021-12-31 by Peter Lembke  
