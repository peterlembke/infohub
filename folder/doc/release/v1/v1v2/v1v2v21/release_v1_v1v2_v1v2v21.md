# [1.2.21] - 2020-08-18
Security roles instead of lists with plugin names makes it easier to be an admin. Updated the template files for developers. New plugin "infohub Trigger" for developers to trigger their plugin functions during development. Textarea improvements. Purge of render cache for developers. Mouse/VR hover effects everywhere. Security improvements in File and Base. Cleaned up CSS. Improved translations. Exchanged some icons to more glossy ones. 

* [Release notes](main,release_v1_v1v2_v1v2v21)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.21)

My plan was to write an article on how easy it is to develop plugins to infohub. I did not find it to be easy mainly due to the rights system with lists of plugins. I needed to change that to roles instead: user, developer, admin. I also changed so the server admin can change role and the user only have to logout and in again.

The article was still hard to write because there were no easy way to trigger the functions in the plugin. Normally I build a plugin with a GUI or extend infohub in some way. Now I wanted to write a totally stand alone server plugin and could not send a message to the plugin. I wrote plugin "Infohub Trigger" to help with that.

To write "Trigger" I needed to know what plugins had status "emerging". I needed to change infohub_file and also improved security there while I was there poking. 
I also noticed that the function "function_names" that are in the base class could not be reached because it was not part of the available CMD functions list. I needed to change the Base class and change in all plugins in Infohub to include them.

Now I could finish Infohub Trigger, I thought. One of the features is a button to get the $default so you have a starting point how your message should look like when sending it to the function. I already had that but there were a bug and I also needed to return the data. While there I found the test function in the Base class. It is a security riek and now when first_default is working I could delete that function.

Another thing that happened was that I bought an Oculus Go VR headset. The product is phased out and you can get them really cheap. I browsed to Infohub and found two things missing - hover effects to confirm what I was pointing at, and audio feedback so I get a confirmation. I fixed hover effects and will take audio later.

During work with the hover effects I also fixed some CSS issues and found bugs that I fixed. And exchanged some lifeless icons to more vivid ones. I noticed that the render cache caused me trouble so I cleared it when I clear the plugin cache.

Fixed some regressions and added a new plugin: mydemo_myplugin that will show how you as a developer can use Infohub Trigger and a start to build your own app.

I am ready to finish the article how easy it is to develop for Infohub, will just release these changes first.

## Added
* Render textarea, added parameter for resize of the textarea
* mydemo_myplugin, added the plugin and rights to that plugin
* HUB-947, Quick buttons for 2 and 3 must clear the render cache too
    infohub_cache.js -> added function remove_data_from_cache_by_prefix_and_keys. Used by SHIFT+CTRL+ALT+2
    infohub_render.js - Added render cache purge for plugin names you provide
* Glossy logo added to folder/doc/images
* HUB-948, Keyboard overlay for debugging buttons added to folder/doc/images 
* Launcher, icons get highlighted with light grey
* Client, Infohub_configlocal.js - Cache the path and config data to a class variable to gain read speed.
    Saw that the language tag are read many times from the local database.
    Now the result are served quicker from the class variable.
* Workbench icons are now highlighted when hovering on them. Useful for mouse and VR headsets     
* HUB-971, Role list indexed on name in config available in every plugin
    Then you can check if a user has a specific security role
* HUB-949, Infohub Trigger, a new plugin where you as a developer can select node, plugin and function. 
    Get the default message. Modify it and send it. Then see the response. Useful while developing plugins.

## Changed
* Template files updated so developers get a quick start.
* Updated contact_doc.md
* Tools Testcall, You can now resize the textarea to see the call better
* infohub_file.php - Only server plugins can now access the functions. Removed the recommended group.
* infohub_storage.php - Removed the recommended group since only server plugins can access this plugin.
* infohub_doc - Changed recommended group to "user". It is just a normal plugin.
* infohub_plugin.js -> plugin_list, now return a list with plugin names that are newer on the server.
* infohub_debug.js -> option 2 to update changed plugins. Now deletes the changed plugins and removes thir render cache from indexedDb.
* infohub_debug.js -> option 3 to delete all plugins. Now deletes all render cache too from indexedDb.
* HUB-951, Debug, updated the translations about render cache
* HUB-952, User groups - Change recommended_security_group to user_role. Only have user,developer,admin
* HUB-950, Client: Contact, remove groups and plugins. Have user_role instead
    The system with groups and plugins was too complicated. Now there are three roles: user, developer, admin
    You select one or more roles for the user.
* Client, RenderMajor head label icon is now part of the toggle link
* Client, Launcher - Changed the refresh SVG icon to a more vivid one
* Button CSS divides into three classes now. And merged togehter with what css you have
* Client, infohub_render_link - Now has a config file with CSS for the link and for hover
    And as usual with config files you can copy the config file to folder/config and set your own values.
* Tabs, File, Radio, Checkbox now have hover effect
* Table, hover effect for rows
* ConfigLocal, changed to $path as index in the class variable
* progress.js now got the progress written to console. Need to find why old sessions get stuck during start
* _GetCmdFunctions, have changed on all PHP plugins to call `parent::_GetCmdFunctionsBase($list)` or
    else we will not get the infohub_base function names. Infohub Trigger want to call the base function `function_names`.
* RenderForm, textarea got better doc for the parameters
* HUB-973, JS function_names. Done as I have done in Base PHP
* HUB-972, _GetCmdFunctions, changed all JS files to also get base function names

## Removed
* infohub_file.php - Did not have any code and I see no point for a timer on the server. Will instead implement cron in the future as a logged in user.
* infohub_file.md - Updated the doc
* Removed CSS from buttons and use the standard css instead
* Removed the old refresh SVG since we have a new one now
* Removed the infohub_base.php -> test function. It was a security risk and we do not need to test in that detail 
* Removed the infohub_base.js -> test function. It was a security risk and we do not need to test in that detail 

## Fixed
* HUB-961, Workbench, clicked icon not highlighted any more. And now works again.
* HUB-964, Launcher, plugins lost their translations. Fixed the regression in ConfigLocal
* HUB-965, Workbench, icon label should be highlighted when plugin are started
* HUB-968, Contact, Server contact - Import does not import the roles
* HUB-967, Contact, Server contact - Delete does not work
* first_default, now fixed so it is added to the response. Shows the first use of _Default 
    This change made the test function obsolete.
* HUB-976, Regression: Can not get full list
* HUB-975, Regression: All is in english. Make sure you set your preferred language in the browser config.
    I had installed the english version of the browser and forgot to set Swedish as default language.
* HUB-979, Asset, Infohub demo gives a base64 string instead of the icon

## Tested
* HUB-969, Contact, server contact - All buttons do as expected
* HUB-959, Contact, client contact - All buttons do as expected
* HUB-960, Login, logout deletes session as expected

## Investigated
