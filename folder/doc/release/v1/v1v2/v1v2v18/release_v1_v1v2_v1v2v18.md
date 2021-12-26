# [1.2.18] - 2020-07-16
Improved: the log-in/logout procedure. Missing rights shows on screen. Added ping function to the base class. Logged-in user shows in launcher with a logout button. Keyboard logout. Lists are now bound to user. Better reject messages. Added public log in accounts with base rights. Changed recommended security group on some plugins. Improved JS code. Changed Launcher title sizes to depend on title length. Bug fixes.

* [Release notes](main,release_v1_v1v2_v1v2v18)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.18)

## Added
* HUB-899, Server: Return an answer for zero messages in the package
* HUB-901, Client: Show log on screen when I try to send to a plugin I do not have rights to
* Server: Added a ping function to Base. Means that all plugins now answer to ping with a pong
* HUB-898, Client: Launcher - I want the logged-in username to show
    And now it does. Added a logout button too and settings in infohub_launcher.json
* HUB-893, Client: Keyboard combination that logs me out 
    SHIFT + CTRL + ALT + 0

## Changed
* HUB-891, Client: My list and full list is now bound to the log-in account locally on the device
* HUB-900, Server: Changed to more detailed reject reason in Exchange -> infohub_ToSort
* Client: index.php refactored. No logic changed.
* Client: Moved the ping function from Exchange to Base. Means that all plugins now answer to ping with a pong
* HUB-898, Login: Correct the public log in accounts to have the proper rights
* Client, Server: Changed recommended_security_group to core for infohub_session, infohub_asset, infohub_launcher, infohub_plugin, infohub_file, infohub_doc
* HUB-903, Client: Workbench, larger titles on short titles. 0.7em is too small
    0.7em is standard. If title length < 12 then 0.85em. if < 8 then 1em. 
    This does not look good, but I'll have it like this until I figure out something better.

## Removed
* Client: Infohub_Exchange, removed almost all typeof and use _IsSet instead

## Fixed
* Doc, Fixed errors in infohub_render_common.md
* Bug, infohub_contact_client.js import now handle the client plugins list
* Bug, infohub_contact.php referenced a variable index that did not exist
* HUB-904, Client: Workbench, Started plugin do not get highlighted

## Tested

## Investigated
* HUB-902, Client: Do not send the package if there are zero messages.
    I already had some code in place that should prevent this.
