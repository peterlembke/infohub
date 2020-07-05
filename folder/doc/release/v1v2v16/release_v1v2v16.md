# [1.2.16] - 2020-07-05
Added a rendering cache. Improved Storage and a demo. Some @todo fixed. Assets cached better. Improved login.  Client transfer with banned_until now works. Translations added. Improved icons. Style added.  

* [Release notes](main,release_v1v2v16)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.16)

## Added
* Server: Infohub_File.php, reading assets now add time stamp so we know when the data was accurate.
* Server, Client: Storage read_many now have wanted data in the paths data array.
* Server, Client: Storage read. Added wanted_data. If used you get only this data back from the read. 
* HUB-710, Client: Asset index - update_specific_assets must update index
    update_plugin_assets_index now works
* HUB-757, Client/Server: infohub_transfer.json - added clear text messages config for debug purposes
    Had to change kick_out_tests_for_infohub.php to allow this.
* HUB-525, Server: Protect the step property in incoming messages
    Client already remove the step parameter in incoming and outgoing messages.
    Server already remove the step parameter in outgoing messages and now it handles the incoming messages too.
    infohub_exchange.php // Client is not allowed to manipulate the step parameter 
* HUB-762, Server/Client: Session config ban_time_seconds
* HUB-767, Server: Session, add banned_until to the session data
* HUB-768, Server: Session, Function set/get/check banned_until
* HUB-780, Add opcache visualizer. /opcache.php now works.
    From [rlerdorf](https://github.com/rlerdorf/opcache-status)
* infohub_base.js -> _GetData, added comments
* infohub_base.php, refactored last return statements to have its own row
* guests can now call responder_check_session_valid
* HUB-766, infohub.php - check if banned
    Now infohub.php checks if you already are banned and throw you out.
* HUB-788, Server: Storage Write Mode: merge + documentation
    Added support for updating part of a post in the Server Storage
* HUB-789, Client: Storage Write Mode: merge
    Now the Client Storage can merge in data.
* HUB-791, Client: Storage demo for server and client Storage.
    You can now test the Storage on the client and server in infohub_demo.
* HUB-802, Server: Storage - read_pattern
    Support paths that end with *
* HUB-804, Server: Storage - write_pattern
    Support paths that end with *
* HUB-801, Client: Storage - read_pattern
    Support paths that end with *
* HUB-805, Client: Storage - write_pattern
    Support paths that end with *   
* HUB-800, Server: Storage - Support wanted_data just like the client does 
* HUB-786, Server: Logout now works. Introduced pending_delete flag so I can sign the answer for a logout request to the server.
* HUB-810, Style Range input. Style buttons.
* HUB-816, Client: Render cache. Firefox javascript is slow. This cache helps.
    In infohub_render I cow cache the rendered HTML if you have provided a cache_key. See Demo and Tools.
    Added cache key in Welcome, Tools, Demo, Workbench, Launcher. Will add in all plugins that have a GUI.
* HUB-817, Client: Render cache 2. Add cache_key to all GUI
    Contact, Debug, Democall, Doc, Keyboard, Launcher, Login, Offline, Translate
    Launcher now cache each plugin information.
* HUB-824, Client: Render - Store the render cache
    Added config infohub_render.json that regulate the render cache.
    In the background I store each rendered data to Storage if flag is set.
    In the background I read all stored cache into memory on first render if flag is set.
    This made a big improvement on the rendering times on Firefox.
* ConfigLocal Zoom and Language got GUI cache key so the rendered html can be cached.
* HUB-828, Demo, Added missing translations in english, spanish and swedish.
* HUB-841, Login, Added missing translations in english, spanish and swedish.
    
## Changed
* Server, Client: Asset, refactoring and send empty array to storage read_many so we get all asset data.
* Plugins that use storage->read_many now send an empty array instead of a dummy value
* Server: infohub_file now return file_size on all assets data
* Icon: infohub_debug icon, removed details to get it below 20Kb
* Doc: ConfigLocal, updated documentation
* HUB-712, Client: Asset config. download_assets yes/no, allowed_asset_types, max_asset_size_kb = 150, asset index_cache_seconds 1 week. 
* HUB-759, Refactor start.js and progess.js
    Changed the use of "use struct", removed ==, added _Empty(), changed some var to const/let.
* HUB-778, Client: Launcher, refresh progress indicator pushes icons. Now it does not.
* HUB-726, Client: Welcome, Remove dead code in event_message and modernize the code
* HUB-787, Client: Logging do not handle info and warning
* HUB-797, Client: _MethodExists should return boolean strings
    Changed that and all usage of the function
* Doc updates: core, installation, raspberrypi, requirements
* HUB-808, progress bar improved with styling
* Client: All button icons was placed 1 px wrong. Corrected that.
* Client: Launcher and Workbench, restricted the icon titles with border-box
* Client: Styled lighter buttons. Constrained the refresh fountain in launcher
* Client: SVG icons for OK and FAIL now have a shadow/glare
* HUB-763, Server, Transfer now attach the right banned_until and banned_seconds from the session
* HUB-819, Client: Keyboard - Change Swedish translation to "Knappar" since it is shorter
* HUB-820, Client: Login - Implode the right hand login account major box
* HUB-763, Client: Transfer keep track of banned_until.
    Now infohub_transfer.js wait until banned_until has passed. 
    Test with tool to get random numbers from the server. Press quickly on the button several times.
* HUB-825, Client: Render cache - box_id can change.
    If I start Tools and then Demo, refresh the page and start Demo then Tools, then I get an error because the 
    box_id have been cached. Now I update 'where' before using the cached data.
* CHANGELOG refactored.
* TERMS refactored. Same terms only more clear who is who.
* HUB-845, Client: Welcome - Show the logo on load

## Removed
* HUB-764, Remove dead code in settings_and_errors.php
* HUB-765, kick-out: Remove file test for infohub.php and update file list for index.php

## Fixed
* Server: Infohub_Session.php -> responder_start_session registered in log-error.log that `data` had the wrong data type. Moved the response default values to each response segment. 
* HUB-784, All translations fail in the plugins
    It was infohub_asset.php that did not convert json contents to array
* HUB-785, Menu progress icon not showing in Tools, Welcome, Demo etc
    Changed infohub_rendermenu to use infohub_renderform as event_handler

## Tested
* HUB-711, Server: Base, Internal_Log depth -1 does not work some times
    Tested with -1 but I can not fix this in a multi message environment.
    I will later evaluate if this feature should exist at all.

## Investigated
* HUB-714, Client: Debug has code that delete the local database.
    // This code should logically be placed in storage_data_localforage
    // but we use this code when we have a problem with Infohub.
    // Nothing says we have a working infohub that can reach that plugin.
* HUB-758, Client: Lower or document requests during startup
    The login procedure need those requests in that order. I can not reduce the number of calls. 
    I saw an empty request in the startup.js. Will fix that in another task.
* HUB-743, Client: Doc, click a link to another doc gives no doc
    It seem to work now without any action.
* HUB-723, Server: Session, Check that the user_name is right
    I do not send the user name in the package. Closing this task.
