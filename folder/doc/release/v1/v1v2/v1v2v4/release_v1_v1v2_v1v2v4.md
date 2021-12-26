# [1.2.4] - 2020-01-01
I started developing Infohub at 2010-01-01 and today 10 years later I give you this release.   

This is a service release with a lot of small changes but also a new feature with the table renderer and my view on doc/accessibility.

* [Release notes](main,release_v1_v1v2_v1v2v4)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.4)

## Added
- infohub_render_table - Now you can use tables
- infohub_demo_table - Demo table
- doc/accessibility - My view on accessibility. A top priority to be implemented.

## Changed
- CHANGELOG - Updated this document
- README - Updated what I am working on
- infohub_contact_client - Now using user_name as ID for a user.
- infohub_launcher - Made the GUI tighter with max width on buttons and information box. Easier to get an overview on big screens.
- infohub_renderform - Button label get padding between text and indicator image. Also added support for css_data.
- infohub_transfer - Deleting the step parameter on outgoing messages from client and from server. We will not try to upset the other node by manipulate the step parameter in the function we call.
- infohub_transfer - Restore the call stack on messages that could not be sent to the server. Then the message can report that it can not be sent.
- infohub_view.js - Refactoring. Removed `var` and introduced `const` and `let`.
- infohub_workbench - Menu icons width/height from 80px to 64px to make the GUI tighter. Still finger friendly.
 
## Removed
- infohub_view.css - Removed word-break.

## Fixed
- infohub_compress.js - Undeclared variables
- infohub_contact - Language files spelling error
- infohub_uuid - refactored, improved stability from exceptions and added phpdoc.
