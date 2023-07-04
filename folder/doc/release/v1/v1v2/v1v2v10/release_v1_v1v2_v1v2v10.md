# [1.2.10] - 2020-03-28
Main focus in this release was to Deprecate iframes. Improve graphics with nicer plugin icon and icons in GUI. Remove bugs in existing plugins. Improve existing documentation. Show asset licenses. Fix fonts on iPad. Optimize SVG images and fix SVG image view bug. Move detailed release logs to the documentation.  

* [Release notes](main,release_v1_v1v2_v1v2v10)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.10)

## Added
- [infohub_welcome_youcan](plugin,infohub_welcome_youcan) - Added a lot of other items that I will implement. Added translations.
- .htaccess - Added comments
- [infohub_doc](plugin,infohub_doc) - Added icon for GPLv3
- [doc/accessibility/keyboard](main,accessibility_keyboard) - New doc with links that lists browser keyboard commands.
- [infohub_asset](plugin,infohub_asset) - GUI added to show all license information on all used plugin assets.
- [infohub_launcher](plugin,infohub_launcher) - Added icons in the GUI

## Changed
- [Demo audio/video/map](plugin,infohub_demo_audio) - You can see how the deprecation of iframes looks like. Old code still works, it just renders a link instead of an iframe.
- Documentation for [render video/audio/map](plugin,infohub_render_audio) - Removed everything about embedding and kept how to render a link.
- README.md - updated with a better start and moved some information.
- New icon for InfoHub Contact, Demo, Demo call, Doc.
- [infohub_welcome_youcan](plugin,infohub_welcome_youcan) - Removed "Shop". I know a lot about e-commerce with 8 years developing for Magento 1/2, but it is not a fit for InfoHub.
- [infohub_transfer.js](plugin,infohub_transfer) - When doing a sub call to the server it leaves the callstack behind and have a matching hub_id to find it on the way back. This hub_id now has a prefix 'callstack-'.
- Font size - changed everywhere from static px to dynamic em. Even the examples in the documentation got updated. I hope that will scale better on iPad when zooming.
- Plugin docs - Added the column command on some of them. It becomes easier to read then. Example: [infohub_base](plugin,infohub_base).
- [InfoHub](plugin,infohub) - Documentation updated with links.
- CHANGELOG.md - moved all details to the documentation. One document for each release. See [documentation](main,release)
- TERMS.md - added an end of document
- Documentation for [infohub_workbench](plugin,infohub_workbench) updated.
- SVG assets - Changed some. Added viewBox and set width=100% and height=100%.
- InfoHub Tabs, Time, checksum_crc32, checksum_luhn, encrypt_none - Changed the last places that did not use dot notation in Javascript.

## Removed
- iframes - [Sanity check](main,core_include_sanitycheck) now report all iframes as a security breach. Sandbox does not give any real protection.
- [infohub_render_video](plugin,infohub_render_video) - YouTube, Vimeo, DailyMotion uses iframes and that is a security breach. The renderer now create a link instead that you can click to open the video in a new tab.
- [infohub_render_map](plugin,infohub_render_map) - Open street map, Google Maps, Bing Maps uses iframes and that is a security breach. The renderer now create a link instead that you can click to open the map in a new tab.
- [infohub_render_audio](plugin,infohub_render_audio) - Jameno, Sound cloud, Spotify uses iframes and that is a security breach. The renderer now create a link instead that you can click to open the audio in a new tab.
- Removed deprecated plugins and icons.
- infohub_markdown - Deprecated and removed. Substituted with [infohub_renderdocument](plugin,infohub_renderdocument).
- infohub_demo_markdown - Since infohub_markdown is gone I also deleted the demo for that plugin.
- .htaccess - The command that remove query params are removed. The kick out tests check that.
- .htaccess - Command that redirect all traffic to https are removed. This is up to the site owner to fix that. And we do have encryption anyhow.
- folder/.htaccess - Removed since it is not used
- folder/plugins/.htaccess - Removed since it is not used

## Fixed
- [infohub_view](plugin,infohub_view) - max-width are always a modula with 160. max-width below 160 became 0. Now they become 160.
- SVG IDs - When having the same IDs in two SVGs with for example gradients then they affect each other. Had a solution in [infohub_render_common](plugin,infohub_render_common), but it did not apply everywhere. Moved that solution to [infohub_render_text](plugin,infohub_render_text), and now it works with SVG images everywhere in the GUI.
 