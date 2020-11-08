# [1.2.13] - 2020-04-30
Focused on deprecating test system and callback. Doc now read root files. New traffic package type, mime type and encoding. Now renders SVG. Login and sessions got some features so we get one step closer to v1.3.0. Reduced number of calls to the server. Now shows message under button and select. User_name available to plugins. Login now mandatory. Any license allowed.

* [Release notes](main,release_v1_v1v2_v1v2v13)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.13)

## Added
- HUB-621 - Server: Now config/user_name is populated so the plugin can act on it
- HUB-604 - Server: Infohub Session - Get allowed plugins list
- HUB-620 - Server: Check incoming messages against the session allowed plugins list
- HUB-637 - Client: Exchange, Have a function ping that return pong
- HUB-636 - Client: Support short tail messages in sub calls
- HUB-639 - Client: Button, show the result text under the button. Flags on button to enable
- HUB-640 - Client: renderform, added support for select boxes to show message
- HUB-640 - Client: GUI buttons that report OK when no rights. In Client and Tools
- HUB-640 - Client: GUI select lists that report OK when no rights. In Client and Tools
- HUB-646 - Client: render, return a flag if a frog was rendered
- HUB-652 - Client: Login, add a refresh button to reload the page on login and logout
- HUB-655 - Client: Login, when setting a password then add a "has_password" flag
- HUB-662 - Client: Give variable desktop_environment to the plugins so they know if run under workbench or standalone
- HUB-654 - Client: Login, simplify login when started in standalone
- HUB-664 - Client, Login - After successful login do an automatic refresh
- HUB-670 - Server: Base _Default, add support for traditional array with keys 0,1,2 and so on
- HUB-673 - Server: add a user in folder/config/infohub_contact.json so I can login without a database
- HUB-676 - Client: Render File, show info box below just as button and select does
- HUB-674 - Server: Login, check that the domain match in the login file
- HUB-658 - Server: Support short tail messages in sub calls. Added messages to _SubCall
- HUB-681 - Client: On sever errors show links to clean out and restart. Done. A must have feature in app mode on a touch device
- HUB-686 - Client: Login, if has_password = false then hide password box

## Changed
- HUB-629 - Client: AJAX must send mime type application/json. And now it does.
- HUB-634 - Client: Render -> render_options, handle being rejected by the server.
- HUB-635 - Client: Contact -> click_refresh_group and refresh_client, return correct OK
- HUB-641 - Client: Translate - Documentation uses deprecated Markdown plugin
- HUB-644 - Client: Doc, update - gives exception
- HUB-642 - Client: Translate, Doc - Renders a frog when the server do not respond. And says OK.
- HUB-647 - Server: plugin, protect some of the functions so only server infohub_plugin can call them
- HUB-651 - Client: Exchange -> startup, check the session and load the right domain or domain_guest
- HUB-650 - Client: Session, when checking session also return user_name
- HUB-659 - Doc, login - Improve the doc for how we login
- HUB-660 - Doc, renderform: button, select. Document that they can now show message text
- HUB-661 - Doc, communication "2020". Document what it is
- HUB-665 - Client: Login, password are ignored
- HUB-666 - Client: Login, if user do not exist on server then limbo
- HUB-671 - Client: Login, if no connection to the database then say so
- HUB-668 - Client: Login, If user not found in the database then say so
- HUB-669 - Client: Exchange config. Add Default guest domain
- HUB-672 - Server: Time out 2 sec too little in kickout tests. Increased to 4 seconds
- HUB-677 - Pi3 tests, Login gives: The random number in the hub_id must contain only numbers. It was Raspbian 32bit integers.
- HUB-685 - Client, Contact doc. Still issues with doc buttons. Missing markdown plugin. Switched to renderdocument
- HUB-680 - Allow plugins to have any license. Now I only require an SPDX license identifier
- HUB-681 - Doc: Write how to share the login files. infohub_login_export

## Removed
- HUB-649 - session.php - remove the file. It is not used
- HUB-648 - define_folders.php - remove test and session

## Fixed
- HUB-616 - Client: Text and textarea - åäö could not be sent to server. Added form encoding and a [convert to UTF-8](https://www.php.net/manual/en/function.utf8-encode.php) when decoding the package on the server.
- HUB-675 - Client: Click on a multi select list and you get an infinite loop
- HUB-679 - Client: Asset, View Welcome with jpeg images then see all Assets. You get a frog and exceptions

## Tested
- HUB-667 - Client: Raspberry Pi3 LAMP server - Test login and new features
- HUB-657 - Client: test login on iPhone SE (2016). Works fast and smooth on the small screen
