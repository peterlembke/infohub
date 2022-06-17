# [1.3.9] - 2022-06-17

Changes made to launcher to make it simpler and perhaps easier to understand.
Reduced memory requirements on the server. Logging if peak memory or execution time is too large.
Improving document handling.

* [Release notes](main,release_v1_v1v3_v1v3v9)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.9)

## Added - new features
* HUB-1598, messages now return the from-parameter from the server. For debug purposes.
* HUB-1604, Rewritten plugins_request to not do any subCall at all.
  Also limited how much size to return. You could get some requested plugins and need to request again.
  All JS plugins are now minified by default. You can set in config what plugins to not minify for debug purposes.
  This change reduced the memory consumption on PHP.
* HUB-1606, Now return peak memory usage. Also added more plugins to start.js to get a faster start.
* HUB-1607, log_if_memory_peak_usage_above_mb = 8
* HUB-1608, log_if_execution_time_is_above_seconds = 1.0
* HUB-1620, server, infohub_doc, internal_GetDocument - Added document size
* HUB-1619, server, infohub_doc, get_documents_list - cached the result with config setting. 24h. Saved 100ms on the server call :-)
* HUB-1623, Removed HTML from Markdown document before download to client
* HUB-1623, Embedded images that have a path. Making the README.md less problematic. It must work on GitHub too.

## Changed - changes in existing functionality
* HUB-1585, Launcher, Show all icons if my list is empty on startup. Because the switch button confuse users
* HUB-1593, render_doc now call infohub_doc_get to get the document instead of asking the server directly
* HUB-1602, Sending large messages get out of memory. Instead of splitting the packageJson I now pull out the section to send
* HUB-1611, plugins_request - Now do not add the last plugin if the package become too large
* HUB-1609, Lowered the PHP memory from 16Mb to 12Mb. Still works
* HUB-1621, infohub_doc PHP/JS - Refactored doc_name to document_name docName to documentName
* HUB-1618, server, infohub_doc, get_documents_list - add checksum and size to each document.
  Renamed checksum_same to is_checksum_same
* HUB-1624, Launcher, Start is now first button. My list is renamed to Favorites. Button to swap lists have moved down.
  Hope this makes it easier for first time users. They look so confused.
* HUB-1622, server, infohub_doc, get_all_documents - Add config to limit response size from get_all_documents
* HUB-1601, server, infohub_doc, get_all_documents - require wanted_documents_list
* HUB-1626, server, infohub_doc, get_all_documents - Return ask_again_documents_list
* HUB-1631, _Translate() can now convert a key without a translation into english
* HUB-1632, Launcher, Translations updated for sv, en, es

## Deprecated - soon-to-be removed features

## Removed - now removed features
* HUB-1587, Workbench: Remove "Help" button. Because the button confuse users

## Fixed - bug fixes
* HUB-1543, Config Local - Language, remove I prefer: sv,en
* HUB-1592, Fixed all eight PHPStan errors with PHPStan v1.6.9
* HUB-1596, Documents with one word in the name were not found
* HUB-1612, Error log, infohub_file - read only real files. internal_Read returned false when it should return true
* HUB-1614, Error, Allowed asset types have wrong data type. It was a default value that should have been an array but was a string
* HUB-1615, Error, Avoided Ajax call with no messages in the package when using debug keys

## Security - in case of vulnerabilities.

## Tested

## Investigated
* HUB-1594, render_doc must cache the rendered document. No need when it now gets the document from infohub_doc_get
* HUB-1563, Libre Translate - Doc do not render. Yes it does.
* HUB-1545, Node contacts - Doc do not work. Yes it does.
* HUB-1586, Doc: All doc buttons must ask InfoHub Doc to render the document. And they do.
* HUB-1595, Offline - Are documents really downloaded? Yes but there are much more docs now, so we get out of memory. Will fix that in HUB-1601
* HUB-1610, Refresh full list - Get 28 same messages in one request. Investigated and I do not get that anymore
* HUB-1613, Refresh full list - Lower memory peak Mb from 10 to 8. I failed. It is 8Mb when I debug all the way. It is 10Mb whe I run without debugger
