# [1.2.12] - 2020-04-19
Focused on deprecating test system and callback. Doc now read root files. New traffic package type. Now renders SVG. Login and sessions got some features, so we get one step closer to v1.3.0. Reduced number of calls to the server.

* [Release notes](main,release_v1_v1v2_v1v2v12)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.12)

## Added
- plugin_test.md - Doc that describe how to test plugins automatically to detect changes in logic compared to expected results. This is a plan for the implementation.
- Sever constant ROOT added to reach the Markdown files in the root.
- LICENSE.md - Added the GPLv3.0 license text in Markdown format.
- infohub.php - kick out tests for the new package type
- package: package_type - The year "2020" when I did the change.
- package messages_encoded - Now the messages are json encoded and base64 encoded. (HUB-615)
- infohub_exchange.php - New function responder_verify_sign_code that are called from infohub.php
- infohub_exchange.php - New protected class property 'sendAnswer' that can be set to "false" to prevent running _AddTransferMessage(). See usage in responder_verify_sign_code where a success should not send back an answer since we handle that in infohub.php
- infohub_exchange.php - guest messages are now verified before let in
- start.js - Added more plugins to _GetNeededPluginNames for configlocal_zoom and language. They are called during system start and need to be there or else we get another call to the server to fetch them. 
- infohub_log in - Added more plugins to launcher.json to reduce the number of calls to the server when using infohub_log in
- infohub_tools_package - New tool to examine packages that go to the server. Documentation added of course.
- infohub_render_svg - Created a rendering plugin for SVG. Documentation added of course. (HUB-618)
- infohub_demo_svg - Created a demo how to use the SVG rendering plugin. Documentation added of course. (HUB-618)
- Server: [infohub_transfer](plugin,infohub_transfer) verify the request package sign_code if it exists. (HUB-601)
- Server: Response packages will have client session_id, sign_code, sign_code_created_at if the request package had a valid sign_code (HUB-600)

## Changed
- Previous release notes - Added more things to the document that had been changed in the previous release.
- InfoHub_Doc - Now also read Markdown files from the root. CHANGELOG, LICENSE, TERMS, README. (HUB-611)
- Changed CHANGELOG to be rendered better in InfoHub.
- package format changed. Also added package_type = "2020".
- infohub_transfer.js - Now support the new package type.
- start.js - Now support the new package type
- session_created_at - now string
- sign_code_created_at - now string

## Removed
- callback - Deprecated callback. If I want a secure system then there can only be one way in to the system and that is through the login. Since I will not use InfoHub for e-commerce and payment callbacks then the callback was just a security risk. Callback might come back later but as a client to a server.
- test system - Deprecated the plugin test system. The system was outdated and required jQuery mobile. I will use another approach that will record live data and detect changes. That is truly automated tests.
- Doc - removed most mentions of the callback and test system from the documentation.
- package to_plugin - we do not allow routing so all messages will go to the receiving node.
- package messages_checksum - It is calculated instead from messages_encoded
- package messages - instead I use messages_encoded
- infohub_transfer - removed function "received"

## Fixed
